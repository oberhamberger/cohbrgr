import { type RspackOptions } from '@rspack/core';
import { resolve } from 'path';
import { getStyleLoader } from '../loader/style.loader';
import {
    CWD,
    isProduction,
    isWatch,
    Mode,
    regexSource,
    regexStyle,
} from '../utils/constants';

export const baseConfig: RspackOptions = {
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'source-map',
    context: resolve(CWD, `./src`),
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.scss'],
    },
    watch: isWatch,

    module: {
        rules: [
            {
                test: regexSource,
                exclude: [/node_modules/],
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
                type: 'javascript/auto',
            },
            {
                test: regexStyle,
                use: getStyleLoader(),
                type: 'css/auto',
            },
        ],
    },

    experiments: {
        css: true,
    },
    stats: {
        colors: true,
    },
};
