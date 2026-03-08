import { resolve } from 'path';

import { defineConfig } from '@rspack/cli';
import {
    CssExtractRspackPlugin,
    ProgressPlugin,
    type RspackOptions,
} from '@rspack/core';
import { merge } from 'webpack-merge';

import { baseConfig, CWD, isCloudRun, isProduction } from '@cohbrgr/build';
import { cloudRunOrigins, ports } from '@cohbrgr/env';

import getModuleFederationPlugins from './rspack.federated.config';

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
        uniqueName: 'content',
        path: resolve(CWD, './dist/client'),
        clean: true,
        assetModuleFilename: 'assets/[hash][ext][query]',
        publicPath: isCloudRun
            ? `${cloudRunOrigins.content}/client/`
            : isProduction
              ? `http://localhost:${ports.content.prod}/client/`
              : `http://localhost:${ports.content.dev}/client/`,
        filename: isProduction ? `[name].[contenthash].js` : `[name].js`,
    },
};

export default defineConfig(merge(baseConfig, config));
