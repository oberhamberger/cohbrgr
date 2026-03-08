import baseConfig from '@cohbrgr/jest';

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'server',
    testEnvironment: 'node',
    rootDir: 'src',
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'index.ts',
        'app/createApp.ts',
        'middleware/cspNonce.ts',
        'middleware/rateLimit.ts',
        'middleware/staticFiles.ts',
        'router/health.ts',
        'server/gracefulStartAndClose.ts',
    ],
};

export default config;
