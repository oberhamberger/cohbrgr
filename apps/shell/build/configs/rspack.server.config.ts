import { resolve } from 'path';
import { baseConfig, CWD, isCloudRun } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import { merge } from 'webpack-merge';
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
        getModuleFederationPlugins().server,
    ],
    output: {
        path: resolve(CWD, './dist/server'),
        filename: '[name].js',
        clean: true,
        publicPath: isCloudRun ? 'https://cohbrgr.com/server/' : 'http://localhost:3000/server/',
        library: { type: 'commonjs2' },
    },
    externalsPresets: { node: true },
    externals: ['express'],
};

export default defineConfig(merge(baseConfig, config));
