import type { InitialOptionsTsJest } from 'ts-jest/dist/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import * as tsconfig from './tsconfig.json';

const moduleNames = pathsToModuleNameMapper(
    tsconfig.compilerOptions.paths /*, { prefix: '<rootDir>/' } */,
);

const config: InitialOptionsTsJest = {
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    roots: ['<rootDir>'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    modulePaths: ['node_modules', '<rootDir>'],
    moduleNameMapper: moduleNames,
};

export default config;
