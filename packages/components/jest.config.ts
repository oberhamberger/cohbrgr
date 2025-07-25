import baseConfig from '@cohbrgr/jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'components',
    testEnvironment: 'jsdom',
    rootDir: './',
};

export default config;
