import type { JestConfigWithTsJest } from 'ts-jest';

export const modules = {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
        'jest-transform-stub',
    '^src/(.*)$': '<rootDir>/src/$1',
};

const config: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: modules,
};

export default config;
