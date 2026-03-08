export default {
    projects: ['src/client/jest.config.ts', 'src/server/jest.config.ts'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/jest.config.ts',
        '!src/**/*.spec.{ts,tsx}',
        // Entry points with side effects - difficult to unit test
        '!src/client/index.ts',
        '!src/client/bootstrap.tsx',
        '!src/server/index.ts',
    ],
};
