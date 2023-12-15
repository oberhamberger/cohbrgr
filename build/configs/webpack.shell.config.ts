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
// import moduleFederationPlugin from 'build/configs/webpack.federated.config';

export default (): Configuration => ({
    ...getWebpackSharedConfig(),
    entry: {
        bundle: 'packages/shell',
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
            name: 'Shell',
            color: '#fff1ee',
        }),
        new MiniCssExtractPlugin({
            filename: isProduction
                ? 'css/[name].[contenthash].css'
                : 'css/[name].css',
        }),
        new CopyPlugin({
            patterns: [{ from: '../../../packages/shell/assets', to: './' }],
        }),
        // moduleFederationPlugin.shell,
        ...(isProduction
            ? [
                  new InjectManifest({
                      swSrc: 'packages/service-worker',
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
        path: resolve(__dirname, '../../dist/shell'),
        filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
    },
});
