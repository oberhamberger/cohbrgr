import sortImports from '@trivago/prettier-plugin-sort-imports';

const config = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    plugins: [sortImports],
    importOrder: [
        '^node:(.*)$',
        'path',
        '^react(.*)',
        '(.*).scss',
        '<THIRD_PARTY_MODULES>',
        '@cohbrgr/(.*)',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};

export default config;
