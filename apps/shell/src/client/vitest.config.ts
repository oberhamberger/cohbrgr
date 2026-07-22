import { fileURLToPath } from 'node:url';

import { defineProject } from '@cohbrgr/vitest';

// Rooted at the app, not this directory, so that every project reports file
// paths relative to the same base — coverage `include`/`exclude` globs are
// resolved from the app root and would not match project-relative paths.
// The URL is resolved here because Vitest resolves a project's `root` against
// the parent config's root, not against this file's location.
export default defineProject({
    name: 'client',
    root: fileURLToPath(new URL('./../../', import.meta.url)),
    environment: 'jsdom',
    include: [
        'src/client/**/__tests__/**/*.+(ts|tsx)',
        'src/client/**/?(*.)+(spec|test).+(ts|tsx)',
    ],
});
