import baseConfig from '@cohbrgr/jest';

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'server',
    testEnvironment: 'node',
    rootDir: 'src',
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)',
    ],
};

export default config;
