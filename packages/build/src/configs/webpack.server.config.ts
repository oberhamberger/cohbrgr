import ESLintPlugin from 'eslint-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { join, resolve } from 'path';
import getStyleLoader from 'src/loader/style.loader';
import {
    CWD,
    isProduction,
    Mode,
    regexSource,
    regexStyle,
} from 'src/utils/constants';
import { Configuration, WebpackPluginInstance } from 'webpack';
import WebpackBar from 'webpackbar';

export default (federationPlugin: WebpackPluginInstance): Configuration => {
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
        target: false,
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
            federationPlugin,
            new NodemonPlugin(),
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: 'index.js',
            clean: true,
            publicPath: '/',
        },
        externals: {
            express: "require('express')",
        },
        stats: {
            colors: true,
        },
    };
};
