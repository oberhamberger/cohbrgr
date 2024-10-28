import { resolve, join } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodeModuleFederation from '@module-federation/node';

import {
    isProduction,
    regexStyle,
    regexSource,
    Mode,
    CWD,
    isShell
} from 'src/utils/constants';
import getStyleLoader from 'src/loader/style.loader';
import EnvironmentConfig from '@cohbrgr/environments';

const { UniversalFederationPlugin } = NodeModuleFederation;

export default async (): Promise<Configuration> => {
    const federationPlugin = await import(CWD + '/build.js');
    const federationOptions = federationPlugin.default.default();
    
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        context: resolve(CWD, `./src`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [join(CWD, ''), join(CWD, '../..', 'node_modules')],
        },
        entry: {
            index: './server/index.ts',
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: regexSource,
                    loader: 'esbuild-loader',
                    exclude: /node_modules/,
                },
                {
                    test: regexStyle,
                    use: getStyleLoader(true, isProduction),
                },
            ],
        },
        plugins: [
            new ESLintPlugin(),
            new WebpackBar({
                name: `Server`,
                color: '#0a9c6c',
            }),
            new UniversalFederationPlugin(federationOptions.server, {}),
            new NodemonPlugin(),
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: 'index.js',
            clean: true,
            publicPath: `localhost:${isShell ? EnvironmentConfig.shell.port : EnvironmentConfig.content.port}/`,

            environment: {
                asyncFunction: true
            }
        },
        externals: {
            express: "require('express')",
        },
        stats: {
            colors: true,
        },
    };
};
