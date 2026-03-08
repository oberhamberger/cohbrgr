export default {
    projects: [
        'src/client/jest.config.ts',
        'src/server/jest.config.ts',
        'env/jest.config.ts',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'env/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/jest.config.ts',
        '!src/**/*.spec.{ts,tsx}',
        '!env/**/*.spec.ts',
        '!env/jest.config.ts',
        // Entry points with side effects - difficult to unit test
        '!src/client/index.ts',
        '!src/client/bootstrap.tsx',
        '!src/server/index.ts',
        '!src/server/server-entry.ts',
        // Uses lazy imports and web-vitals which require browser/runtime context
        '!src/client/App.tsx',
        // Service worker files - run in browser context
        '!src/client/service-worker/**',
        '!src/client/utils/register-service-worker.ts',
        // SSG middleware - requires generated static files at specific paths
        '!src/server/middleware/jam.ts',
        // SSR render - error handlers require mocking React internals
        '!src/server/middleware/render.tsx',
        // Template components - file system error catch blocks
        '!src/server/template/components/Javascript.html.tsx',
        '!src/server/template/components/Stylesheets.html.tsx',
    ],
};
