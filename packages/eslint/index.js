import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export const config = tseslint.config([
    // Base ESLint + TS recommendations
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // Project-wide options
    {
        ignores: ['dist', 'node_modules'],
    },
    // Jest specific configuration
    {
        files: ['**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**/*.ts'],
        plugins: {
            jest: jestPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.spec.json'],
            },
        },
        rules: {
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/valid-expect': 'error',
        },
    },
    // General TypeScript configuration
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
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
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: 'react**',
                            group: 'builtin',
                            position: 'after',
                        },
                        {
                            pattern: '@cohbrgr/**',
                            group: 'external',
                            position: 'before',
                        },
                    ],
                    alphabetize: {
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
    prettier,
]);

export default config;
