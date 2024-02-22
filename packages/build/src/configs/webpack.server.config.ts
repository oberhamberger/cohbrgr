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
    isShell,
} from 'src/utils/constants';
import getStyleLoader from 'src/loader/style.loader';
import moduleFederationPlugin from 'src/configs/webpack.federated.config';

console.log(
    [
        join(CWD, ''),
        join(CWD, 'node_modules'),
        join(
            dirname(require.main?.filename || ''),
            '../../..',
            'node_modules',
        ),
        join(dirname(require.main?.filename || ''), 'node_modules'),
        'node_modules',
    ]
);

export default (): Configuration => {
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        context: resolve(CWD, `./src/server`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [
                join(CWD, ''),
                join(CWD, 'node_modules'),
                join(
                    dirname(require.main?.filename || ''),
                    '../../..',
                    'node_modules',
                )
            ],
        },
        entry: {
            server: `src/server`,
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    type: 'javascript/auto',
                    resolve: {
                      fullySpecified: false,
                    },
                  },
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
                name: `Server`,
                color: '#0a9c6c',
            }),
            ...moduleFederationPlugin(true, isShell),
            new NodemonPlugin(),
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: '[name].js',
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
