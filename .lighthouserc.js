module.exports = {
    ci: {
        collect: {
            startServerCommand: 'pnpm run serve',
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
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'network-dependency-tree-insight': 'warn',
                'unused-javascript': 'warn',
                'uses-text-compression': 'warn',
            },
        },
        upload: {
            target: 'filesystem',
        },
    },
};
