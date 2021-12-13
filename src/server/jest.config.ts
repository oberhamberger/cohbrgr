import { pathsToModuleNameMapper } from 'ts-jest';
import baseConfig, { moduleNames } from '../../jest.config.base';
import * as tsconfig from '../../tsconfig.json';

const modules = {
    ...moduleNames,
    ...pathsToModuleNameMapper(
        tsconfig.compilerOptions
            .paths /*, { prefix: '<rootDir>/src/server/' } */,
    ),
};

const config = {
    ...baseConfig,
    name: 'server',
    displayName: 'server',
    testEnvironment: 'node',
    rootDir: './../../',
    modulePaths: ['node_modules', '<rootDir>'],
    testMatch: [
        '**/server/**/__tests__/**/*.+(ts|tsx|js)',
        '**/server/**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    moduleNameMapper: modules,
};

export default config;
