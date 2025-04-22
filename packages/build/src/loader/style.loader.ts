import { type RuleSetUseItem } from '@rspack/core';

export const getStyleLoader = (): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'builtin:lightningcss-loader',
            options: {
                modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]', // Customize if needed
                },
            },
        },
        {
            loader: 'sass-loader',
            options: {
                api: 'modern-compiler',
                implementation: require.resolve('sass-embedded'),
            },
        },
    ];

    return loaders;
};
