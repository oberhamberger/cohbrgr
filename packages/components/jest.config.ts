import type { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from '@cohbrgr/jest';

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
