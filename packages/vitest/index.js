import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const jsdomSetup = fileURLToPath(new URL('./setup-jsdom.js', import.meta.url));

/**
 * Default spec glob, mirroring the Jest `testMatch` this replaces.
 */
export const testMatch = [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)',
];

/**
 * Coverage defaults, applied by both helpers because `coverage` is resolved
 * from the *root* config — a multi-project app would otherwise fall back to
 * Vitest's v8 default and fail on the missing provider package.
 *
 * istanbul, not v8: v8 collects coverage from the process's own V8 isolate,
 * which misses everything a jsdom suite evaluates in its VM context, so those
 * suites report zero files. istanbul instruments the source itself and reports
 * both environments consistently.
 *
 * The default `text` reporter renders an empty table here (it fails to build a
 * tree from the absolute paths istanbul emits), so totals go to the terminal
 * and per-file detail to browsable HTML.
 *
 * @param {Record<string, unknown>} [overrides]
 */
const withCoverageDefaults = (overrides) => ({
    provider: 'istanbul',
    reporter: ['text-summary', 'html'],
    ...overrides,
});

/**
 * Shared Vitest config for the workspace.
 *
 * Path aliases come from each package's own `tsconfig.json` via Vite's native
 * `resolve.tsconfigPaths` rather than being restated here: the mappings differ
 * per package (`src/*` resolves to `./*` in packages but `./src/*` in apps),
 * and Jest additionally leaned on `modulePaths: ['node_modules', '<rootDir>']`
 * as a catch-all root resolver that Vitest has no equivalent for. Reading the
 * tsconfig keeps resolution identical to what `tsc` does, for every package.
 *
 * Globals are deliberately NOT enabled: spec files import `describe`/`it`/
 * `expect`/`vi` from 'vitest' explicitly. Ambient globals would need a types
 * entry that only resolves for files owned by a tsconfig, and most packages
 * exclude their specs — so editors fell back to an inferred project and
 * reported every global as undefined. Explicit imports resolve everywhere.
 *
 * @param {{ name: string, environment?: 'node' | 'jsdom', root?: string } & Record<string, unknown>} options
 */
export const defineProject = ({
    name,
    environment = 'node',
    root = '.',
    include = testMatch,
    ...test
}) =>
    defineConfig({
        resolve: { tsconfigPaths: true },
        test: {
            name,
            environment,
            root,
            include,
            // jsdom suites get the jest-dom matchers registered for them.
            ...(environment === 'jsdom'
                ? { setupFiles: [jsdomSetup] }
                : undefined),
            ...test,
            // after the spread, so a caller's partial `coverage` (say, just an
            // exclude list) merges with the defaults instead of replacing them
            coverage: withCoverageDefaults(test.coverage),
        },
    });

/**
 * Composes the per-area configs of a multi-project app (client / server / env)
 * into one suite, mirroring Jest's `projects` field.
 *
 * @param {{ projects: string[], coverage?: Record<string, unknown> }} options
 */
export const defineProjects = ({ projects, coverage }) =>
    defineConfig({
        test: { projects, coverage: withCoverageDefaults(coverage) },
    });

// Re-exported so apps compose configs without depending on vitest directly.
export { defineConfig };

export default defineProject;
