import { resolve, join, dirname } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import {
    isProduction,
    regexStyle,
    regexSource,
    Mode,
    CWD,
} from 'build/build/src/utils/constants';
import getStyleLoader from 'build/build/src/loader/style.loader';

export default (pack: string): Configuration => {
    console.log(pack);
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'inline-source-map',
        context: resolve(__dirname, `./packages/${pack}/server`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [
                join(CWD, ''),
                join(CWD, 'node_modules'),
                join(
                    dirname(require.main?.filename || ''),
                    '..',
                    'node_modules',
                ),
                join(dirname(require.main?.filename || ''), 'node_modules'),
                'node_modules',
                'node_modules',
            ],
            alias: { packages: 'packages/' },
        },
        entry: {
            server: `packages/${pack}/server`,
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: regexSource,
                    loader: 'ts-loader',
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
                name: `${pack}: server`,
                color: '#0a9c6c',
            }),
            new NodemonPlugin(),
        ],
        output: {
            path: resolve(__dirname, '../../dist/server/'),
            filename: 'index.js',
            clean: true,
            publicPath: '/',
        },
        externals: {
            express: "require('express')",
        },
    };
};
