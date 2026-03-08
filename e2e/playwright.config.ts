import { defineConfig } from '@playwright/test';

const baseURL = process.env['E2E_BASE_URL'] || 'http://localhost:3000';
const isLocal = baseURL.includes('localhost');

export default defineConfig({
    testDir: './specs',
    fullyParallel: true,
    forbidOnly: !!process.env['CI'],
    retries: process.env['CI'] ? 1 : 0,
    workers: process.env['CI'] ? 1 : undefined,
    reporter: process.env['CI'] ? 'github' : 'html',
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
    ...(isLocal && {
        webServer: [
            {
                command: 'pnpm run serve:api',
                cwd: '..',
                port: 3002,
                reuseExistingServer: true,
                timeout: 30_000,
            },
            {
                command: 'pnpm run serve:content',
                cwd: '..',
                port: 3001,
                reuseExistingServer: true,
                timeout: 30_000,
            },
            {
                command: 'pnpm run serve:shell',
                cwd: '..',
                port: 3000,
                reuseExistingServer: true,
                timeout: 30_000,
            },
        ],
    }),
});
