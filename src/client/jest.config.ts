import { pathsToModuleNameMapper } from 'ts-jest';
import baseConfig, { moduleNames } from '../../jest.config.base';
import { compilerOptions } from '../../tsconfig.base.json';

const modules = {
    ...moduleNames,
    ...pathsToModuleNameMapper(
        compilerOptions.paths /*, { prefix: '<rootDir>/src/client/' } */,
    ),
};

const config = {
    ...baseConfig,
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
