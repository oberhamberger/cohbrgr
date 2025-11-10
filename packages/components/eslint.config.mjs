import baseConfig from '@cohbrgr/eslint';

export default [
    ...baseConfig,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.spec.json',
            },
        },
    },
];
