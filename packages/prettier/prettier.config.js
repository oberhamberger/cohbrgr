const config = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    plugins: ['@trivago/prettier-plugin-sort-imports'],
    importOrder: [
        '^node:(.*)$',
        'path',
        '^react(.*)',
        '<THIRD_PARTY_MODULES>',
        '@cohbrgr/(.*)',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};

module.exports = config;
