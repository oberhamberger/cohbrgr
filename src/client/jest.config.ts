import { pathsToModuleNameMapper } from 'ts-jest/utils';
import baseConfig, { moduleNames } from '../../jest.config.base';
import * as tsconfig from '../../tsconfig.json';

const modules = {
    ...moduleNames,
    ...pathsToModuleNameMapper(
        tsconfig.compilerOptions
            .paths /*, { prefix: '<rootDir>/src/client/' } */,
    ),
};

const config = {
    ...baseConfig,
    name: 'client',
    displayName: 'client',
    testEnvironment: 'jsdom',
    rootDir: './../../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/client/**/__tests__/**/*.+(ts|tsx|js)',
        '**/client/**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    moduleNameMapper: modules,
};

export default config;
