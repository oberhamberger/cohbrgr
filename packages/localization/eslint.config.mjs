import config from '@cohbrgr/eslint';

export default [
    ...config,
    {
        ignores: ['jest.config.ts', '**/*.spec.ts', '**/*.spec.tsx'],
    },
];
