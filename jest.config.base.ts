import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

export const moduleNames = {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
        'jest-transform-stub',
};

const config: InitialOptionsTsJest = {
    preset: 'ts-jest/presets/default-esm',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true,}],
    },
};

export default config;
