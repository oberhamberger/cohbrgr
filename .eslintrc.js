module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    },
    overrides: [
        {
            files: ['src/client/**'],
            extends: '.eslint.client.js',
        },
    ],
};
