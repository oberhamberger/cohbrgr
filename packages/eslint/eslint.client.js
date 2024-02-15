const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

console.log('client eslint config');

module.exports = {
    languageOptions: {
        ecmaVersion: "latest",
        parser: typescriptEslintParser,
    },
    plugins: {
        typescriptEslint: typescriptEslintPlugin,
    },
    rules: {
        'no-unused-vars': 'error'
    }
};
