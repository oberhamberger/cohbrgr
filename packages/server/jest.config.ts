import type { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from '@cohbrgr/jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'server',
    testEnvironment: 'node',
    rootDir: '.',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
};

export default {
    projects: [config],
};
