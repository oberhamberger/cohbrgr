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

export default (): Configuration => {
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            alias: { src: 'src/' },
        },
        context: resolve(CWD, `./src`),
        entry: './server/index.ts',
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
                name: `Server`,
                color: '#0a9c6c',
            }),
            moduleFederationPlugin(true, isShell).server,
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
