import { fileURLToPath } from 'node:url';

import { defineProject } from '@cohbrgr/vitest';

// Rooted at the app, not this directory, so that every project reports file
// paths relative to the same base — coverage `include`/`exclude` globs are
// resolved from the app root and would not match project-relative paths.
// The URL is resolved here because Vitest resolves a project's `root` against
// the parent config's root, not against this file's location.
export default defineProject({
    name: 'server',
    root: fileURLToPath(new URL('./../../', import.meta.url)),

    include: [
        'src/server/**/__tests__/**/*.+(ts|tsx)',
        'src/server/**/?(*.)+(spec|test).+(ts|tsx)',
    ],
});
