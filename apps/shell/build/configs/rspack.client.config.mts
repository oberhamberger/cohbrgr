import { baseConfig, CWD, isProduction } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import {
    CopyRspackPlugin,
    CssExtractRspackPlugin,
    ProgressPlugin,
    type RspackOptions,
} from '@rspack/core';
import { resolve } from 'path';
import getModuleFederationPlugins from './rspack.federated.config.mts';

const config: RspackOptions = {
    ...baseConfig,
    entry: {
        bundle: './client/index.ts',
    },
    target: 'web',

    plugins: [
        new ProgressPlugin({
            template:
                '{spinner:.blue} {elapsed_precise:.dim.bold} {bar:50.cyan/blue.dim} {bytes_per_sec:.dim} {pos:.bold}/{len:.bold} {msg:.dim}',
        }),
        new CssExtractRspackPlugin({
            filename: isProduction
                ? 'css/[name].[contenthash].css'
                : 'css/[name].css',
        }),
        new CopyRspackPlugin({
            patterns: [{ from: './client/assets', to: './' }],
        }),
        getModuleFederationPlugins().client,
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
        publicPath: 'http://localhost:3000/client',
        filename: isProduction ? `js/[name].[contenthash].js` : `js/[name].js`,
    },
};

export default defineConfig(config);
