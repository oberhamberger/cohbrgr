import { baseConfig, CWD, getModuleFederationPlugins, isProduction, isShell } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import { CopyRspackPlugin, ProgressPlugin, rspack, type RspackOptions } from '@rspack/core';
import { resolve } from 'path';

const config: RspackOptions = {
    ...baseConfig,
    entry: {
        bundle: './client/index.tsx',
    },
    target: 'web',

    plugins: [
        new ProgressPlugin({
            template: '{spinner:.blue} {elapsed_precise:.dim.bold} {bar:50.cyan/blue.dim} {bytes_per_sec:.dim} {pos:.bold}/{len:.bold} {msg:.dim}'
        }),
        new rspack.CssExtractRspackPlugin({
            filename: isProduction
                ? 'css/[name].[contenthash].css'
                : 'css/[name].css',
        }),
        new CopyRspackPlugin({
            patterns: [{ from: './client/assets', to: './' }],
        }),
        getModuleFederationPlugins(true).client,
    ],
    optimization: {
        chunkIds: isProduction ? 'natural' : 'named',
        minimize: isProduction,
        splitChunks: {
            chunks: 'all',
        },
    },
    experiments: {
        css: true
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

export default defineConfig(config);
