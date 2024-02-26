import { resolve, join } from 'path';
import { Configuration, WebpackPluginInstance } from 'webpack';
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
    Mode,
    CWD,
    isShell,
} from 'src/utils/constants';
import getStyleLoader from 'src/loader/style.loader';

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
            bundle: './client/index.tsx',
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
                name: `Client`,
                color: '#fff1ee',
            }),
            new MiniCssExtractPlugin({
                filename: isProduction
                    ? 'css/[name].[contenthash].css'
                    : 'css/[name].css',
            }),
            federationPlugin,
            ...(isShell
                ? [
                      new CopyPlugin({
                          patterns: [{ from: './client/assets', to: './' }],
                      }),
                  ]
                : []),
            ...(isProduction && isShell
                ? [
                      new InjectManifest({
                          swSrc: './client/service-worker',
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
            splitChunks: {
                chunks: 'all',
            },
        },
        output: {
            path: resolve(CWD, './dist/client'),
            clean: true,
            filename: isProduction
                ? `${isShell ? 'js/' : ''}[name].[contenthash].js`
                : `${isShell ? 'js/' : ''}[name].js`,
        },
    };
};
