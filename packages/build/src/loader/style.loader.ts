import { type RuleSetUseItem } from '@rspack/core';

/**
 * Returns the Rspack loader configuration for processing SCSS/CSS files with Lightning CSS and Sass.
 */
export const getStyleLoader = (): RuleSetUseItem[] => {
    const loaders: RuleSetUseItem[] = [
        {
            loader: 'builtin:lightningcss-loader',
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                api: 'modern-compiler',
                implementation: require.resolve('sass-embedded'),
            },
        },
    ];

    return loaders;
};
