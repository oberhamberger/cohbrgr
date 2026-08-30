import { resolve } from 'path';

import { DefinePlugin, type RspackOptions } from '@rspack/core';

import { getStyleLoader } from '../loader/style.loader';
import {
    CWD,
    isDevelopment,
    isProduction,
    Mode,
    regexSource,
    regexStyle,
} from '../utils/constants';

export const baseConfig: RspackOptions = {
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'source-map',
    context: resolve(CWD, `./src`),
    plugins: [
        new DefinePlugin({
            'process.env.CLOUD_RUN': JSON.stringify(
                process.env['CLOUD_RUN'] ?? '',
            ),
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.scss', '.css'],
        alias: {
            src: resolve(CWD, './src'),
            data: resolve(CWD, './data'),
        },
    },
    watch: isDevelopment,

    module: {
        rules: [
            {
                test: regexSource,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'builtin:swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            {
                // `publicPath: '/'` overrides the app-level publicPath, which
                // is origin-absolute for Module Federation. Without it the built
                // CSS carries `http://localhost:3000/fonts/...` into production,
                // where `font-src 'self'` blocks it.
                test: /\.woff2$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][ext]', publicPath: '/' },
            },
            {
                test: regexStyle,
                use: getStyleLoader(),
                type: 'css/auto',
            },
        ],
        generator: {
            'css/auto': {
                // The server and client bundles must agree on every scoped
                // class name. A node build defaults to `exportsOnly`, which
                // hashes idents through a different path than a web build, so
                // the server renders `navigation-<A>` against a stylesheet that
                // defines `.navigation-<B>` and the styles drop on first paint.
                // Forcing it false costs an unused .css per server chunk.
                exportsOnly: false,
                localIdentName: '[local]-[hash:base64:6]',
            },
        },
    },

    experiments: {
        css: true,
    },
    stats: {
        colors: true,
    },
};
