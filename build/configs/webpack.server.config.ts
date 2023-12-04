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
} from 'build/utils/constants';
import getStyleLoader from 'build/loader/style.loader';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    context: resolve(__dirname, 'src'),
    entry: {
        server: 'src/server',
    },
    target: 'node',
    cache: {
        type: 'filesystem',
        cacheDirectory: resolve(__dirname, '../../.temp_cache/server'),
        allowCollectingMemory: true,
        buildDependencies: {
            config: [__filename],
        },
    },
    infrastructureLogging: {
        appendOnly: true,
        level: 'verbose',
    },
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        modules: [
            join(CWD, ''),
            join(CWD, 'node_modules'),
            join(dirname(require.main?.filename || ''), '..', 'node_modules'),
            join(dirname(require.main?.filename || ''), 'node_modules'),
            'node_modules',
            'node_modules',
        ],
        alias: { src: 'src/' },
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
