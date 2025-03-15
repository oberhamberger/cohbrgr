
import { type RuleSetUseItem } from '@rspack/core';

export const getStyleLoader = (): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'builtin:lightningcss-loader',
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
