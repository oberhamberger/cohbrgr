import { resolve, join } from 'path';
import { Configuration, WebpackPluginInstance } from 'webpack';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

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

export default (federationPlugin?: WebpackPluginInstance): Configuration => {

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
        experiments: {
            outputModule: true,
        },
        module: {
            rules: [
                {
                    test: regexSource,
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            transform: {
                                react: {
                                    runtime: 'automatic'
                                }
                            }
                        }
                    },
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
            federationPlugin,
            new NodemonPlugin(),
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: 'index.js',
            clean: true,
            module: true,
            publicPath: `localhost:${isShell ? EnvironmentConfig.shell.port : EnvironmentConfig.content.port}/`
        },
        externals: {
            express: "import express",
        },
        stats: {
            colors: true,
        },
    };
};
