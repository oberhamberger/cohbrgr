import type { JestConfigWithTsJest } from 'ts-jest';
import baseConfig from '../../jest.config.base';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'client',
    testEnvironment: 'jsdom',
    rootDir: './../../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/client/**/__tests__/**/*.+(ts|tsx|js)',
        '**/client/**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
};

export default config;
