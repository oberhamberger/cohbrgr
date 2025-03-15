import { baseConfig, CWD, getModuleFederationPlugins } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import { resolve } from 'path';

const config: RspackOptions = {
    ...baseConfig,
    entry: {
        index: './server/index.ts',
    },
    target: 'node',

    plugins: [
        new ProgressPlugin({
            template: '{spinner:.yellow} {elapsed_precise:.dim.bold} {bar:50.yellow/red.dim} {bytes_per_sec:.dim} {pos:.bold}/{len:.bold} {msg:.dim}'
        }),
        getModuleFederationPlugins(true).server,
    ],
    output: {
        path: resolve(CWD, './dist/server'),
        filename: 'index.js',
        clean: true,
        publicPath: '/',
    },
    externals: {
        express: "require('express')",
    },
    stats: {
        colors: true,
    },
};

export default defineConfig(config);
