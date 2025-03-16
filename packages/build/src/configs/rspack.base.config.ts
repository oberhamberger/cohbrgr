import { type RspackOptions } from '@rspack/core';
import { join, resolve } from 'path';
import { getStyleLoader } from '../loader/style.loader';
import { CWD, isProduction, Mode, regexSource, regexStyle } from '../utils/constants';

export const baseConfig: RspackOptions = {
    mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
    devtool: isProduction ? false : 'source-map',
    context: resolve(CWD, `./src`),
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        modules: [join(CWD, ''), join(CWD, '..', 'node_modules'), join(CWD, '../..', 'node_modules')],
    },

    module: {
        rules: [
            {
                test: regexSource,
                loader: 'builtin:swc-loader',
                exclude: /node_modules/,
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
}
