import { InjectManifest } from '@aaroon/workbox-rspack-plugin';
import {
    baseConfig,
    CWD,
    isAnalyze,
    isProduction,
    serviceWorker,
} from '@cohbrgr/build';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { defineConfig } from '@rspack/cli';
import {
    CopyRspackPlugin,
    CssExtractRspackPlugin,
    ProgressPlugin,
    type RspackOptions,
} from '@rspack/core';
import { resolve } from 'path';
import { merge } from 'webpack-merge';
import getModuleFederationPlugins from './rspack.federated.config';

const config: RspackOptions = {
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
        ...(isProduction
            ? [
                  new InjectManifest({
                      swSrc: './client/service-worker',
                      swDest: serviceWorker,
                      include: [/\.js$/],
                  }),
              ]
            : []),
        ...(isAnalyze ? [new RsdoctorRspackPlugin()] : []),
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
        assetModuleFilename: 'assets/[hash][ext][query]',
        filename: isProduction ? `[name].[contenthash].js` : `[name].js`,
    },
};

export default defineConfig(merge(baseConfig, config));
