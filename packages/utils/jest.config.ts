import type { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from '@cohbrgr/jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'utils',
    testEnvironment: 'node',
    rootDir: 'src',
    testMatch: ['**/?(*.)+(spec|test).+(ts|tsx)'],
};

export default config;
