import { resolve } from 'path';

import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { merge } from 'webpack-merge';

import {
    CWD,
    baseConfig,
    isDevelopment
} from '@cohbrgr/build';


const config: RspackOptions = {
    ...baseConfig,
    name: 'api',
    entry: {
        index: './index.ts',
    },
    target: 'async-node',

    plugins: [
        new ProgressPlugin({
            template:
                '{spinner:.magenta} {elapsed_precise:.dim.bold} {bar:50.magenta/gray.dim} {bytes_per_sec:.dim} {pos:.bold}/{len:.bold} {msg:.dim}',
        }),
        ...(isDevelopment
            ? [
                  new NodemonPlugin({
                      watch: resolve('./dist'),
                      script: './dist/index.js',
                      nodeArgs: ['NODE_ENV=development'],
                  }),
              ]
            : []),
    ],
    output: {
        uniqueName: 'data',
        path: resolve(CWD, './dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs-module',
        clean: true,
    },
    externalsPresets: { node: true },
    externals: ['express'],
};

export default defineConfig(merge(baseConfig, config));
