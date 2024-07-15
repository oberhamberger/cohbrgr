import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export const config = tseslint.config([
    eslint.configs.recommended,
    tseslint.configs.recommended,
]);

export default config;
