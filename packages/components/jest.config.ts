import baseConfig from '@cohbrgr/jest';

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'components',
    testEnvironment: 'jsdom',
    rootDir: 'src',
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)',
    ],
};

export default config;
