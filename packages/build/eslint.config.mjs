import config from '@cohbrgr/eslint';

export default [
    ...config,
    {
        ignores: ['vitest.config.ts', '**/*.spec.ts'],
    },
];
