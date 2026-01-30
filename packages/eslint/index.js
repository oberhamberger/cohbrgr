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
        files: [
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/__tests__/**/*.ts',
            '**/__tests__/**/*.tsx',
        ],
        plugins: {
            jest: jestPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.spec.json'],
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
            // Import order aligned with Prettier (packages/prettier): node/path, react, scss, third-party, @cohbrgr, relative, then type-only
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
                            pattern: '.*\\.scss$',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: '@cohbrgr/**',
                            group: 'external',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: { caseInsensitive: true },
                    'newlines-between': 'always',
                },
            ],
        },
    },
    prettier,
]);

export default config;
