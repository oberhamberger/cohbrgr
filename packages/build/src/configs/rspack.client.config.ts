import { type Configuration, CopyRspackPlugin, ProgressPlugin, rspack, type RspackPluginInstance } from '@rspack/core';
import { join, resolve } from 'path';

import {
    CWD,
    isAnalyze,
    isProduction,
    isShell,
    Mode
} from '../utils/constants';


export const getRspackClientConfig = (federationPlugin: RspackPluginInstance): Configuration => {
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        context: resolve(CWD, `./src`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [join(CWD, ''), join(CWD, '..', 'node_modules')],
        },
        entry: './client/index.tsx',
        target: 'web',
        
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
                federationPlugin,
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
