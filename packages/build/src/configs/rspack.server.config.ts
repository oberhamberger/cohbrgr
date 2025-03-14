import { type Configuration, ProgressPlugin } from '@rspack/core';
import { join, resolve } from 'path';
import {
    CWD,
    isProduction,
    Mode,
    regexSource,
    regexStyle,
} from 'src/utils/constants';

import getStyleLoader from 'src/loader/style.loader';

export default (): Configuration => {
    return {
        mode: isProduction ? Mode.PRODUCTION : Mode.DEVELOPMENT,
        devtool: isProduction ? false : 'source-map',
        context: resolve(CWD, `./src`),
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss'],
            modules: [join(CWD, ''), join(CWD, '../..', 'node_modules')],
        },
        entry: {
            index: './server/index.ts',
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: regexSource,
                    loader: 'esbuild-loader',
                    exclude: /node_modules/,
                },
                {
                    test: regexStyle,
                    use: getStyleLoader(true, isProduction),
                },
            ],
        },
        plugins: [
            new ProgressPlugin()
        ],
        output: {
            path: resolve(CWD, './dist/server'),
            filename: 'index.js',
            clean: true,
            publicPath: '/',
        },
        externals: {
            express: "require('express')",
        },
        stats: {
            colors: true,
        },
    };
};
