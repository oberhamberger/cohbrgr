module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run serve',
            numberOfRuns: 2,
            url: ['http://localhost:3000', 'http://localhost:3000/offline'],
            settings: {
                chromeFlags: '--no-sandbox',
                onlyCategories: [
                    'performance',
                    'accessibility',
                    'best-practices',
                    'seo',
                ],
            },
            disableStorageReset: true,
            // Disable the storage reset to keep the session alive
            // and avoid re-authentication for each run
            // This is useful for testing authenticated pages
            // or pages that require a specific state
            // You can also use the `--disable-storage-reset` flag
            // when running Lighthouse from the command line
            // or in CI/CD pipelines
            // For more information, see:
            //
        },
        assert: {
            preset: 'lighthouse:recommended',
        },
        upload: {
            target: 'filesystem',
        },
    },
};
