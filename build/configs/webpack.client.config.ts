import { resolve, dirname, join } from 'path';
import { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { Mode, isProduction, regexStyle, regexSource, CWD } from '..';
import getStyleLoader from '../loader/style.loader';

const getWebpackClientConfig = (): Configuration => {
    const clientConfig: Configuration = {
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
                join(dirname(require.main.filename), '..', 'node_modules'),
                join(dirname(require.main.filename), 'node_modules'),
                'node_modules',
            ],
            alias: { src: 'src/' },
        },
        plugins: [
            new ESLintPlugin(),
            new WebpackBar({
                name: 'Client',
                color: '#99ccff',
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: 'css/[id].css',
            }),
            new CopyPlugin({
                patterns: [
                    { from: '../../../src/client/resources/static', to: './' },
                ],
            }),
        ],
        optimization: {
            chunkIds: isProduction ? 'natural' : 'named',
            minimize: isProduction,
            splitChunks: {
                chunks: 'all',
            },
        },
        output: {
            path: resolve(__dirname, '../../dist/client'),
            filename: 'js/[id].[contenthash].js',
        },
    };

    const isAnalyze = process.env.ANALYZE === 'true';
    if (isAnalyze) {
        clientConfig.plugins.unshift(
            new BundleAnalyzerPlugin({
                generateStatsFile: true,
                openAnalyzer: true,
                analyzerPort: 0,
            }),
        );
    }

    return clientConfig;
};

export default getWebpackClientConfig;
