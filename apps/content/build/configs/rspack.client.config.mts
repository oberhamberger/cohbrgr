import { baseConfig, CWD, isProduction } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import {
    CssExtractRspackPlugin,
    ProgressPlugin,
    type RspackOptions,
} from '@rspack/core';
import { resolve } from 'path';
import getModuleFederationPlugins from './rspack.federated.config.mts';

const config: RspackOptions = {
    ...baseConfig,
    entry: {
        bundle: './client/index.tsx',
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
        getModuleFederationPlugins().client,
    ],
    optimization: {
        chunkIds: isProduction ? 'natural' : 'named',
        minimize: isProduction,
        splitChunks: {
            chunks: 'all',
        },
    },
    experiments: {
        css: true,
    },
    output: {
        path: resolve(CWD, './dist/client'),
        clean: true,
        publicPath: '/',
        filename: isProduction ? `[name].[contenthash].js` : `[name].js`,
    },
};

export default defineConfig(config);
