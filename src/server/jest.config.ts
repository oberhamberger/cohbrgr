import { pathsToModuleNameMapper } from 'ts-jest';
import baseConfig, { moduleNames } from '../../jest.config.base';
import { compilerOptions } from '../../tsconfig.base.json';

const modules = {
    ...moduleNames,
    ...pathsToModuleNameMapper(
        compilerOptions.paths /*, { prefix: '<rootDir>/src/server/' } */,
    ),
};

const config = {
    ...baseConfig,
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
