import { resolve } from 'path';
import { Configuration } from 'webpack';
import getWebpackSharedConfig from 'build/configs/webpack.shared.config';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { isProduction, regexStyle, regexSource } from 'build/utils/constants';
import getStyleLoader from 'build/loader/style.loader';

export default (): Configuration => ({
    ...getWebpackSharedConfig(),
    entry: {
        server: 'packages/server',
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
            name: 'Server',
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
});
