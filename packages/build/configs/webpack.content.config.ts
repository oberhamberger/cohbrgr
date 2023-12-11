import { resolve } from 'path';
import { Configuration } from 'webpack';
import getWebpackSharedConfig from 'build/configs/webpack.shared.config';
import WebpackBar from 'webpackbar';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
    isAnalyze,
    isProduction,
    regexStyle,
    regexSource,
} from 'build/utils/constants';
import getStyleLoader from 'build/loader/style.loader';
import moduleFederationPlugin from 'build/configs/webpack.federated.config';

export default (): Configuration => ({
    ...getWebpackSharedConfig(),
    entry: {
        bundle: '/content',
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
            name: 'Content',
            color: '#99ccff',
        }),
        new MiniCssExtractPlugin({
            filename: isProduction
                ? 'css/[name].[contenthash].css'
                : 'css/[name].css',
        }),
        moduleFederationPlugin.content,
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
    output: {
        path: resolve(__dirname, '../../../dist/content'),
        filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
    },
});
