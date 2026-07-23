import { defineProject } from '@cohbrgr/vitest';

export default defineProject({
    name: 'server',
    coverage: {
        exclude: [
            'src/index.ts',
            'src/app/createApp.ts',
            'src/middleware/cspNonce.ts',
            'src/middleware/rateLimit.ts',
            'src/middleware/staticFiles.ts',
            'src/router/health.ts',
            'src/server/gracefulStartAndClose.ts',
        ],
    },
});
