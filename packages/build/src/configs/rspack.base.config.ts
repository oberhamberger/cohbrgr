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
                test: regexStyle,
                use: getStyleLoader(),
                type: 'css/auto',
            },
        ],
        generator: {
            'css/auto': {
                // SSR needs the server bundle and the client stylesheet to agree
                // on every scoped class name. rspack derives the local ident from
                // two different code paths: a node build defaults to `exportsOnly`
                // (it emits only the name mappings, no stylesheet) while a web build
                // emits a full stylesheet — and the `[hash]` token comes out
                // different between them, even with a fixed localIdentHashSalt. The
                // server then renders `navigation-<A>` while the stylesheet only
                // defines `.navigation-<B>`, so the styles silently drop on first
                // paint. Forcing `exportsOnly: false` puts the server through the
                // same stylesheet hashing path as the client, so both produce an
                // identical hash. The server emits an unused `.css` file per chunk
                // as a result; it is never served (the app only exposes dist/client).
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
