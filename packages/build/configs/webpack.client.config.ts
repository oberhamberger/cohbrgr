import { resolve } from 'path';
import { Configuration } from 'webpack';
import getWebpackSharedConfig from 'build/configs/webpack.shared.config';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
    isAnalyze,
    isProduction,
    serviceWorker,
    regexStyle,
    regexSource,
} from 'build/utils/constants';
import getStyleLoader from 'build/loader/style.loader';

export default (): Configuration => ({
    ...getWebpackSharedConfig(),
    entry: {
        bundle: '/client',
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
    plugins: [
        new ESLintPlugin(),
        new WebpackBar({
            name: 'Client',
            color: '#fff1ee',
        }),
        new MiniCssExtractPlugin({
            filename: isProduction
                ? 'css/[name].[contenthash].css'
                : 'css/[name].css',
        }),
        new CopyPlugin({
            patterns: [{ from: './client/assets', to: './' }],
        }),
        ...(isProduction
            ? [
                  new InjectManifest({
                      swSrc: './service-worker',
                      swDest: serviceWorker,
                      include: [/\.js$/],
                  }),
              ]
            : []),
        ...(isAnalyze
            ? [
                  new BundleAnalyzerPlugin({
                      generateStatsFile: true,
                      openAnalyzer: true,
                      analyzerPort: 0,
                  }),
              ]
            : []),
    ],
    optimization: {
        chunkIds: isProduction ? 'natural' : 'named',
        minimize: isProduction,
        runtimeChunk: { name: 'webpack' },
        splitChunks: {
            cacheGroups: {
                react: {
                    name: 'react',
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    chunks: 'all',
                    priority: 40,
                    enforce: true,
                },
                workbox: {
                    name: 'workbox',
                    test: /[\\/]node_modules[\\/](workbox-window)[\\/]/,
                    chunks: 'all',
                    priority: 40,
                    enforce: true,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    output: {
        path: resolve(__dirname, '../../../dist/client'),
        filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
    },
});
