import { baseConfig, CWD } from '@cohbrgr/build';
import { defineConfig } from '@rspack/cli';
import { ProgressPlugin, type RspackOptions } from '@rspack/core';
import { resolve } from 'path';
import getModuleFederationPlugins from './rspack.federated.config';
import { merge } from 'webpack-merge';

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
        library: { type: 'commonjs2' },
        publicPath: 'http://localhost:3000/',
    },
    externalsPresets: { node: true },
    externals: ['express'],
};

export default defineConfig(merge(baseConfig, config));