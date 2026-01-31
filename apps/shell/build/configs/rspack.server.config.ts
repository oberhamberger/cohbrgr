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

import getModuleFederationPlugins from './rspack.federated.config';

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
                      watch: [
                          resolve('./dist/*'),
                          resolve('../content/dist/*'),
                      ],
                      script: './dist/server/index.js',
                      args: ['NODE_ENV=development'],
                  }),
              ]
            : []),
        getModuleFederationPlugins().server,
    ],
    output: {
        uniqueName: 'shell',
        path: resolve(CWD, './dist/server'),
        filename: '[name].js',
        clean: true,
        publicPath: isCloudRun
            ? 'https://cohbrgr.com/server/'
            : isProduction
              ? 'http://localhost:3000/server/'
              : 'http://localhost:3030/server/',
        library: { type: 'commonjs2' },
    },
    externalsPresets: { node: true },
    externals: ['express', '@cohbrgr/shell/env'],
};

export default defineConfig(merge(baseConfig, config));
