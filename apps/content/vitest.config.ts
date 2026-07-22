import { defineProjects } from '@cohbrgr/vitest';

export default defineProjects({
    projects: ['src/client/vitest.config.ts', 'src/server/vitest.config.ts'],
    coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
            'src/**/*.d.ts',
            'src/**/vitest.config.ts',
            'src/**/*.spec.{ts,tsx}',
            // Entry points with side effects - difficult to unit test
            'src/client/index.ts',
            'src/client/bootstrap.tsx',
            'src/server/index.ts',
        ],
    },
});
