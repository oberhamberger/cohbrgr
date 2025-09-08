import { resolve } from 'path';

import { type RspackOptions } from '@rspack/core';

import { getStyleLoader } from '../loader/style.loader';
import {
    CWD,
    Mode,
    isProduction,
    regexSource,
    regexStyle,
} from '../utils/constants';

export const baseConfig: RspackOptions = {
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'source-map',
    context: resolve(CWD, `./src`),
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.scss'],
        alias: {
            src: resolve(CWD, './src'),
        },
    },
    watch: false,

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
