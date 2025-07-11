import baseConfig from '@cohbrgr/jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'server',
    testEnvironment: 'node',
    rootDir: './../../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/server/**/__tests__/**/*.+(ts|tsx|js)',
        '**/server/**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
};

export default config;
