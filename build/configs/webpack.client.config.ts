import { resolve, dirname, join } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import {
Mode,
isProduction,
regexStyle,
regexSource,
CWD,
serviceWorker,
} from '../utils/constants';
import getStyleLoader from '../loader/style.loader';

const isAnalyze = process.env.ANALYZE === 'true';

export default (): Configuration => ({
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'inline-source-map',
    context: resolve(__dirname, 'src'),
    entry: {
        client: 'src/client',
    },
    target: 'web',
    module: {
        rules: [
            {
                test: regexSource,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: regexStyle,
                use: getStyleLoader(false, isProduction),
            },
        ],
    },
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
        alias: { src: 'src/' },
    },
    plugins: [
        new ESLintPlugin(),
        new WebpackBar({
            name: 'Client',
            color: '#fff1ee',
        }),
        new MiniCssExtractPlugin({
            filename: isProduction
                ? 'css/[id].[contenthash].css'
                : 'css/[name].css',
        }),
        new CopyPlugin({
            patterns: [{ from: '../../../src/assets/static', to: './' }],
        }),
        ...(isProduction
            ? [new InjectManifest({
                    swSrc: 'src/service-worker',
                    swDest: serviceWorker,
                    include: [/\.js$/],
               })]
        : []),
        ...(isAnalyze 
            ? [new BundleAnalyzerPlugin({
                generateStatsFile: true,
                openAnalyzer: true,
                analyzerPort: 0,
            })] : [])
    ],
    optimization: {
        chunkIds: isProduction ? 'natural' : 'named',
        minimize: isProduction,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    output: {
        path: resolve(__dirname, '../../dist/client'),
        filename: isProduction
            ? 'js/[id].[contenthash].js'
            : 'js/[name].js',
    },
});
