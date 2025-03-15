import { type Configuration, ProgressPlugin } from '@rspack/core';
import { resolve } from 'path';
import {
    CWD
} from '../utils/constants';


export const getRspackServerConfig = (): Configuration => {
    return {

        entry: {
            index: './server/index.ts',
        },
        target: 'node',
        
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
