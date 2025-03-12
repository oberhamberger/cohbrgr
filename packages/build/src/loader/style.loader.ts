import { resolve } from 'path';

import  { type RuleSetUseItem, rspack } from '@rspack/core';

export default (isServer: boolean, isProduction: boolean): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'css-loader',
            options: {
                modules: {
                    exportOnlyLocals: isServer,
                    exportLocalsConvention: 'camelCase',
                    exportGlobals: true,
                    localIdentContext: resolve(__dirname, 'src'),
                    localIdentName: isProduction
                        ? '[hash:base64:6]'
                        : '[name]__[local]__[hash:base64:3]',
                },
                esModule: true,
                importLoaders: 1,
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'sass-loader',
        },
    ];

    const clientLoader = {
        loader: rspack.CssExtractRspackPlugin.loader,
        options: {
            esModule: true,
        },
    };

    !isServer && loaders.unshift(clientLoader);

    return loaders;
};
