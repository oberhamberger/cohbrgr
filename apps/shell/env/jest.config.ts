import baseConfig from '@cohbrgr/jest';

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'env',
    testEnvironment: 'node',
    rootDir: './../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: ['**/env/**/?(*.)+(spec|test).+(ts|tsx|js)'],
};

export default config;
