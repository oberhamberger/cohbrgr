import { resolve } from 'path';

import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { merge } from 'webpack-merge';

import {
    baseConfig,
    CWD,
    isCloudRun,
    isDevelopment,
    isProduction,
} from '@cohbrgr/build';

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
        ...(isDevelopment
            ? [
                  new NodemonPlugin({
                      watch: resolve('./dist'),
                      script: './dist/server/index.js',
                      nodeArgs: ['NODE_ENV=development'],
                  }),
              ]
            : []),
        getModuleFederationPlugins().server,
    ],
    output: {
        uniqueName: 'content',
        path: resolve(CWD, './dist/server'),
        filename: '[name].js',
        libraryTarget: 'commonjs-module',
        publicPath: isCloudRun
            ? 'https://cohbrgr-content-o44imzpega-oa.a.run.app/server/'
            : isProduction
              ? 'http://localhost:3001/server/'
              : 'http://localhost:3031/server/',
        clean: true,
    },
    externalsPresets: { node: true },
    externals: ['express', '@cohbrgr/content/env'],
};

export default defineConfig(merge(baseConfig, config));
