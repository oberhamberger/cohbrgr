import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export const config = tseslint.config([
    // Base ESLint + TS recommendations
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // Project-wide options
    {
        ignores: ['dist', 'node_modules'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
            },
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },
    // Prettier override to avoid conflicts
    prettier,
]);

export default config;
