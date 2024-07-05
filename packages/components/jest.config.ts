import type { JestConfigWithTsJest } from 'ts-jest';
import baseConfig from '@cohbrgr/jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'components',
    testEnvironment: 'jsdom',
    rootDir: './',
};

export default config;
