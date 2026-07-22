import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vitestPlugin from '@vitest/eslint-plugin';
import tseslint from 'typescript-eslint';

export const config = tseslint.config([
    // Base ESLint + TS recommendations
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // Project-wide options
    {
        ignores: ['dist', 'node_modules'],
    },
    // Vitest specific configuration
    {
        files: [
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/__tests__/**/*.ts',
            '**/__tests__/**/*.tsx',
        ],
        plugins: {
            vitest: vitestPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.spec.json'],
            },
        },
        rules: {
            'vitest/no-disabled-tests': 'warn',
            'vitest/no-focused-tests': 'error',
            'vitest/no-identical-title': 'error',
            'vitest/valid-expect': 'error',
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
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
    prettier,
]);

export default config;
