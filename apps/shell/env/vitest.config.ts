import { fileURLToPath } from 'node:url';

import { defineProject } from '@cohbrgr/vitest';

export default defineProject({
    name: 'env',
    root: fileURLToPath(new URL('./../', import.meta.url)),
    include: ['env/**/?(*.)+(spec|test).+(ts|tsx)'],
});
