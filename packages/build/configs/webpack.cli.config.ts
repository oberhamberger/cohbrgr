import { join, resolve, dirname } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import NodemonPlugin from 'nodemon-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import {
    Mode,
    isProduction,
    regexStyle,
    regexSource,
    CWD,
} from '../utils/constants';
import getStyleLoader from '../loader/style.loader';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    context: resolve(__dirname, '../../../packages/build'),
    entry: {
        cli: 'packages/build',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: regexSource,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            join(CWD, ''),
            join(CWD, 'node_modules'),
            join(dirname(require.main?.filename || ''), '..', 'node_modules'),
            join(dirname(require.main?.filename || ''), 'node_modules'),
            'node_modules',
            'node_modules',
        ],
        alias: { build: 'build/' },
    },
    plugins: [
        new ESLintPlugin(),
        new WebpackBar({
            name: 'CLI',
            color: 'red',
        }),
    ],
    output: {
        path: resolve(__dirname, '../../dist/cli'),
        filename: 'index.js',
        clean: true,
        publicPath: '/',
    },
});
