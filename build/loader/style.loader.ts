import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetUseItem } from 'webpack';

export default (isServer: boolean, isProduction: boolean): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'css-loader',
            options: {
                modules: {
                    exportOnlyLocals: isServer,
                    exportLocalsConvention: 'camelCase',
                    exportGlobals: true,
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
        loader: MiniCssExtractPlugin.loader,
        options: {
            esModule: true,
        },
    };

    !isServer && loaders.unshift(clientLoader);

    return loaders;
};
