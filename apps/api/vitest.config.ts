import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    resolve: {
        // Jest resolved these via modulePaths: ['node_modules', '<rootDir>'],
        // a catch-all Vitest has no equivalent for — each root-relative bare
        // import needs an explicit alias instead.
        alias: [
            { find: /^src\/(.*)$/, replacement: `${root}src/$1` },
            { find: /^data\/(.*)$/, replacement: `${root}data/$1` },
        ],
    },
    test: {
        name: 'api',
        globals: true,
        environment: 'node',
        root,
        include: [
            '**/__tests__/**/*.+(ts|tsx|js)',
            '**/?(*.)+(spec|test).+(ts|tsx|js)',
        ],
    },
});
