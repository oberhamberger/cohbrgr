import { resolve } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const styleLoaders = (isServer: boolean, isProduction: boolean): any[] => {
    const loaders: any[] = [
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentContext: resolve(__dirname, '../../../src'),
                    exportOnlyLocals: isServer,
                    exportLocalsConvention: 'camelCase',
                    exportGlobals: true,
                    localIdentName: isProduction
                        ? '[hash:base64:6]'
                        : '[name]__[local]__[hash:base64:3]',
                },
                esModule: true,
                importLoaders: 2,
                sourceMap: !isProduction,
            },
        },
        {
            loader: 'sass-loader',
        },
    ];

    const clientLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            esModule: true,
        },
    };

    !isServer && loaders.unshift(clientLoader);

    return loaders;
};

export default styleLoaders;
