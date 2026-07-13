# Migrate the test layer from Jest to Vitest

Replace Jest with Vitest across the workspace so tests run ESM-native, unblocking dependency upgrades that ship ESM-only.

## Motivation

The test layer currently runs Jest in **CommonJS mode**. The `ts-jest/presets/default-esm` preset in `@cohbrgr/jest` is effectively inert: because the base tsconfig is `module: nodenext` and most packages lack `"type": "module"`, ts-jest emits CommonJS. This is fine today, but it blocks two dependency upgrades and forces CJS-interop workarounds:

- **react-router 8** — ships **pure ESM** with no `react-router-dom` v8 (that package is frozen at 7.18.1; v8 consolidates everything into `react-router`). The app-code migration is trivial (import swaps; `build` and `lint` pass), but Jest's CommonJS runtime can't `require()` react-router v8, which also uses `import.meta.hot`. Making it work under Jest requires a growing stack of babel shims (`@babel/preset-env` + a custom `import.meta`-neutralizing plugin + `transformIgnorePatterns` gymnastics). That scaffolding exists **only** because Jest runs CJS.
- **typescript 7** — the native (Go) compiler. `ts-jest` (peer `>=4.3 <7`) and `typescript-eslint` (peer `>=4.8.4 <6.1.0`) both hard-exclude it today. This is gated on the broader toolchain, not just our test runner, but a modern runner is a prerequisite.

Vitest is ESM-native (no `--experimental-vm-modules`), transforms ESM dependencies without babel shims, and mocks without Jest's hoisting constraints. Migrating deletes every CJS workaround at once and lets react-router 8 land as a clean import swap.

## Scope

- Replace `@cohbrgr/jest` (Jest + ts-jest preset) with a shared Vitest config package (or a root `vitest.workspace.ts`).
- Convert every package's `test` target to Vitest, keeping the `nx run-many -t test` orchestration and per-project configs intact.
- Rewrite the **12 `jest.mock(...)` call sites across 8 test files** to Vitest's `vi.mock(...)` (ESM-safe; no hoisting workarounds needed).
- Preserve current behavior: `@testing-library/react` + jsdom for component/client tests, `node` environment for server tests, `html-validate/jest` matchers, and the `jest-transform-stub` asset stubs (Vitest handles assets via `css`/`assets` config or inline stubs).
- Keep `pnpm run test`, `pnpm run test:components`, and the CI `pnpm run test` invocation working unchanged from the caller's side.

Out of scope: the react-router 8 and typescript 7 upgrades themselves — they become follow-up work once this lands (react-router 8 is a near-trivial import swap afterward).

## Implementation

### Shared config (`packages/vitest/` or root workspace file)

Mirror the current `@cohbrgr/jest` surface: a base config exporting the equivalents of `preset`, `moduleNameMapper` (path aliases like `^src/(.*)$`), and asset stubbing. Two environments — `jsdom` for client, `node` for server — expressed as Vitest projects.

### Per-package configs

Each app/package that currently has `jest.config.ts` (and the shell's multi-project split under `src/client`, `src/server`, `env`) gets an equivalent Vitest config extending the shared base. Test file globbing and coverage-exclusion lists carry over from the existing `collectCoverageFrom` blocks.

### Mock migration

`jest.mock` → `vi.mock`, `jest.fn` → `vi.fn`, `jest.spyOn` → `vi.spyOn`, etc. The 12 `jest.mock` sites are the error-prone part; do them file-by-file with the suite green after each.

## Plan

1. Add Vitest + shared config package; wire one leaf package (e.g. `@cohbrgr/utils` or `@cohbrgr/env`) as a proof of concept.
2. Port the shared testing-library / jsdom setup and asset stubs.
3. Migrate packages without mocks first (`env`, `utils`, `components`, `localization`, `figma`, `build`).
4. Migrate packages with mocks (`server`, `api`, and the shell's `src/server` / `src/client` suites) — rewrite `jest.mock` → `vi.mock` one file at a time.
5. Swap the `test` target wiring so `nx run-many -t test` drives Vitest; confirm `pnpm run test` and `test:components` pass.
6. Delete `@cohbrgr/jest`, ts-jest, and any leftover babel/CJS-interop config.
7. Update `docs/07-unit-testing.md` and the CI notes in `CLAUDE.md`.
8. Follow-up (separate proposals/PRs): land **react-router 8** as an import swap; revisit **typescript 7** once `typescript-eslint` ships stable native support.

## Open Questions

- Shared config as a workspace package (`packages/vitest/`) mirroring today's `@cohbrgr/jest`, or a single root `vitest.workspace.ts`? The package approach matches the existing convention; the workspace file is less boilerplate.
- Coverage provider: `v8` (no instrumentation, fast) vs `istanbul` (matches current jest coverage semantics more closely). Does anything consume the coverage output (e.g. a threshold gate)?
- Does `html-validate/jest` have a Vitest-compatible entrypoint, or do we register its matchers manually via `expect.extend`?
- Nx has first-class Vitest support (`@nx/vite`) — adopt it for caching/affected, or keep the current thin `test` script per package?
- Sequencing vs the deferred react-router 8 work: land Vitest fully first, or migrate the shell suites and react-router 8 together since they touch the same SSR render tests?
