import { CWD, baseConfig, isCloudRun } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import { resolve } from 'path';

import { merge } from 'webpack-merge';

import getModuleFederationPlugins from './rspack.federated.config.ts';

const config: RspackOptions = {
    ...baseConfig,
    name: 'server',
    entry: {
        index: './server/index.ts',
    },
    target: 'async-node',

    plugins: [
        new ProgressPlugin({
            template:
                '{spinner:.yellow} {elapsed_precise:.dim.bold} {bar:50.yellow/red.dim} {bytes_per_sec:.dim} {pos:.bold}/{len:.bold} {msg:.dim}',
        }),
        getModuleFederationPlugins().server,
    ],
    output: {
        path: resolve(CWD, './dist/server'),
        filename: '[name].js',
        libraryTarget: 'commonjs-module',
        publicPath: isCloudRun
            ? 'https://cohbrgr-content-o44imzpega-oa.a.run.app/server/'
            : 'http://localhost:3001/server/',
        clean: true,
    },
    externalsPresets: { node: true },
    externals: ['express'],
};

export default defineConfig(merge(baseConfig, config));
