import { resolve, join } from 'path';
import  { type Configuration, rspack, ProgressPlugin, CopyRspackPlugin} from '@rspack/core';

import {
    isAnalyze,
    isProduction,
    regexStyle,
    regexSource,
    Mode,
    CWD,
    isShell,
} from 'src/utils/constants';
import getStyleLoader from 'src/loader/style.loader';

export default (): Configuration => {
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
                    loader: 'esbuild-loader',
                    exclude: /node_modules/,
                },
                {
                    test: regexStyle,
                    use: getStyleLoader(false, isProduction),
                },
            ],
        },
        plugins: [
            new ProgressPlugin(),
            new rspack.CssExtractRspackPlugin({
                filename: isProduction
                    ? 'css/[name].[contenthash].css'
                    : 'css/[name].css',
            }),
            ...(isShell
                ? [
                      new CopyRspackPlugin({
                          patterns: [{ from: './client/assets', to: './' }],
                      }),
                  ]
                : []),
            ...(isProduction && isShell
                ? [

                  ]
                : []),
            ...(isAnalyze
                ? [

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
            publicPath: '/',
            filename: isProduction
                ? `${isShell ? 'js/' : ''}[name].[contenthash].js`
                : `${isShell ? 'js/' : ''}[name].js`,
        },
    };
};
