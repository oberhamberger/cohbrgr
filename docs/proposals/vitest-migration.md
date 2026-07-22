# Migrate the test layer from Jest to Vitest

Replace Jest with Vitest across the workspace so tests run ESM-native, unblocking dependency upgrades that ship ESM-only.

## Motivation

The test layer currently runs Jest in **CommonJS mode**. The `ts-jest/presets/default-esm` preset in `@cohbrgr/jest` is effectively inert: because the base tsconfig is `module: nodenext` and most packages lack `"type": "module"`, ts-jest emits CommonJS. This is fine today, but it blocks two dependency upgrades and forces CJS-interop workarounds:

- **react-router 8** — ships **pure ESM** with no `react-router-dom` v8 (that package is frozen at 7.18.1; v8 consolidates everything into `react-router`). The app-code migration is trivial (import swaps; `build` and `lint` pass), but Jest's CommonJS runtime can't `require()` react-router v8, which also uses `import.meta.hot`. Making it work under Jest requires a growing stack of babel shims (`@babel/preset-env` + a custom `import.meta`-neutralizing plugin + `transformIgnorePatterns` gymnastics). That scaffolding exists **only** because Jest runs CJS.
- **typescript 7** — the native (Go) compiler. `ts-jest` (peer `>=4.3 <7`) and `typescript-eslint` (peer `>=4.8.4 <6.1.0`) both hard-exclude it today. This is gated on the broader toolchain, not just our test runner, but a modern runner is a prerequisite. _Re-verified 2026-07: still blocked at `ts-jest@29.4.11` and `typescript-eslint@8.65.0`._

Vitest is ESM-native (no `--experimental-vm-modules`), transforms ESM dependencies without babel shims, and mocks without Jest's hoisting constraints. Migrating deletes every CJS workaround at once and lets react-router 8 land as a clean import swap.

## Scope

- Replace `@cohbrgr/jest` (Jest + ts-jest preset) with a shared Vitest config package (or a root `vitest.workspace.ts`).
- Convert every package's `test` target to Vitest, keeping the `nx run-many -t test` orchestration and per-project configs intact.
- Rewrite the **12 `jest.mock(...)` call sites across 8 test files** to Vitest's `vi.mock(...)` (ESM-safe; no hoisting workarounds needed), plus the wider `jest.*` surface across the 41 spec files — see [Migration hazards](#migration-hazards) for the parts that are not a mechanical find-and-replace.
- Convert the **14 `jest.config.ts` files**. Note this is not one per package: `shell` splits into `src/client`, `src/server` and `env`, and `content` into `src/client` and `src/server`, so the nested multi-project layout has to be modelled as Vitest projects.
- Preserve current behavior: `@testing-library/react` + jsdom for component/client tests, `node` environment for server tests, `html-validate` matchers, and the `jest-transform-stub` asset stubs (Vitest handles assets via `css`/`assets` config or inline stubs).
- Keep `pnpm run test`, `pnpm run test:components`, and the CI `pnpm run test` invocation working unchanged from the caller's side.

Out of scope: the react-router 8 and typescript 7 upgrades themselves — they become follow-up work once this lands (react-router 8 is a near-trivial import swap afterward).

## Implementation

### Shared config (`packages/vitest/` or root workspace file)

Mirror the current `@cohbrgr/jest` surface: a base config exporting the equivalents of `preset`, `moduleNameMapper` (path aliases like `^src/(.*)$`), and asset stubbing. Two environments — `jsdom` for client, `node` for server — expressed as Vitest projects.

### Per-package configs

Each app/package that currently has `jest.config.ts` (and the shell's multi-project split under `src/client`, `src/server`, `env`) gets an equivalent Vitest config extending the shared base. Test file globbing and coverage-exclusion lists carry over from the existing `collectCoverageFrom` blocks.

### Mock migration

The bulk is mechanical: `jest.fn` (42 sites) → `vi.fn`, `jest.spyOn` (9) → `vi.spyOn`, `jest.clearAllMocks` (7) / `jest.restoreAllMocks` (8) → their `vi.` equivalents.

Two things keep this diff small:

- **Set `globals: true`.** Proven in the spike: with globals enabled, spec files that never touch `jest.*` need **zero changes** — `describe`/`it`/`expect`/`beforeEach` all resolve. The diff is therefore bounded to the files that actually call a `jest.` API, not all 41 spec files.
- The `jest.Mock` **type** annotations (14 sites across 4 files) become `Mock` via `import type { Mock } from 'vitest'` — **not** `vi.Mock`. There is no `vi` type namespace, so a naive `jest.` → `vi.` rename produces code that runs but does not typecheck.

Do it file-by-file with the suite green after each. The items below are where a blind rename produces silently-passing or broken tests.

### Migration hazards

**1. `requireActual`/`requireMock` are synchronous; the Vitest equivalents are not.** This is the sharpest one. `vi.importActual` and `vi.importMock` return Promises, so every factory using them must become `async`:

```ts
// before — sync spread inside the factory
jest.mock('@cohbrgr/server', () => ({
    ...jest.requireActual('@cohbrgr/server'),
    sendJsonWithEtag: jest.fn(),
}));

// after — factory must be async
vi.mock('@cohbrgr/server', async () => ({
    ...(await vi.importActual('@cohbrgr/server')),
    sendJsonWithEtag: vi.fn(),
}));
```

Affects both API controller specs. `FederatedContent.spec.tsx` is the worst case: its factory pulls `useContext` from `react` and `AppStateContext` from an aliased path via two separate sync `requireActual` calls, then defines a React component from them — all of which has to be threaded through one async factory. The two `jest.requireMock('@cohbrgr/utils')` calls in `content-health.spec.ts` are easier, since they already sit inside `async` test bodies and just need an `await`.

**2. Three bare `jest.mock(path)` calls rely on Jest automocking.** In `translation.controller.spec.ts` (2) and `navigation.controller.spec.ts` (1), with **no `__mocks__` directories anywhere in the repo**. Vitest does automock a factory-less `vi.mock`, but the semantics are not identical to Jest's, so these three need their assertions re-checked rather than assumed — an automock that returns `undefined` where Jest returned a mock function will fail loudly, but the reverse can pass vacuously.

**3. Those same paths are aliased** (`src/modules/...`), so `vi.mock` has to resolve through `resolve.alias` — the replacement for today's `moduleNameMapper`. Confirmed working in the spike.

**4. `modulePaths: ['node_modules', '<rootDir>']` has no Vitest equivalent.** Jest uses it as a catch-all root resolver, which is how bare imports like `data/translations.json` resolve today. Vitest needs an **explicit alias per root-relative import prefix** (`src/*` and `data/*` in the api package). Missing one fails loudly at import time, so it is self-revealing — but every package's `modulePaths` has to be audited for which prefixes it was silently covering.

**5. JSON module mocks change shape.** Under Jest's CJS interop a mock factory's return value _is_ the default export; under Vitest's ESM the return value is the **module namespace**. So a JSON mock must nest its body under `default`:

```ts
// Jest: factory return is the default export
jest.mock('data/navigation.json', () => ({ hero: { nodes: [...] } }));

// Vitest: factory return is the namespace
vi.mock('data/navigation.json', () => ({ default: { hero: { nodes: [...] } } }));
```

Also present and straightforward, but needs confirming rather than assuming: fake timers (`useFakeTimers`, `advanceTimersByTimeAsync`, `getTimerCount`) and one `jest.resetModules`.

### Spike result

The `api` package was migrated end-to-end on `feature/vitest-spike` as a feasibility check. It was chosen because one spec (`navigation.controller.spec.ts`) exercises hazards 1–3 simultaneously: an aliased bare automock, a sync `requireActual` spread inside a factory, and `jest.Mock` casts.

Outcome: **parity at 5 suites / 41 tests**, Jest and Vitest alike, in ~200ms versus Jest's ~1.5s. Total diff was ~100 lines across 4 spec files plus a 27-line `vitest.config.ts`. Hazards 4 and 5 were both discovered _during_ the spike rather than predicted, which is the main argument for porting the remaining packages one at a time rather than in a single sweep.

Caveat: `api` is the simplest package — `node` environment, no jsdom, no React, no `html-validate`. It does not derisk the shell's three-project split, the `FederatedContent` async-factory rewrite, or the testing-library setup.

## Plan

1. Add Vitest + shared config package; wire one leaf package (e.g. `@cohbrgr/utils` or `@cohbrgr/env`) as a proof of concept.
2. Port the shared testing-library / jsdom setup and asset stubs.
3. Migrate packages without mocks first (`env`, `utils`, `components`, `localization`, `figma`, `build`).
4. Migrate packages with mocks (`server`, `api`, and the shell's `src/server` / `src/client` suites) — rewrite `jest.mock` → `vi.mock` one file at a time.
5. Swap the `test` target wiring so `nx run-many -t test` drives Vitest; confirm `pnpm run test` and `test:components` pass.
6. Delete `@cohbrgr/jest`, ts-jest, and any leftover babel/CJS-interop config.
7. Update `docs/07-unit-testing.md` and the CI notes in `CLAUDE.md`.
8. Follow-up (separate proposals/PRs): land **react-router 8** as an import swap; revisit **typescript 7** once `typescript-eslint` ships stable native support.

## Resolved

Checked 2026-07, so the plan no longer depends on these:

- **`html-validate` ships a `./vitest` entrypoint** (`html-validate/vitest`, ESM-only — fine under Vitest). No manual `expect.extend` needed; it's a straight swap from `html-validate/jest`.
- **`@testing-library/jest-dom` ships `./vitest`** too, and we are already on v7 which requires it be paired with an explicit `@testing-library/dom` peer (10.4.1 installed).
- **`@nx/vite` publishes 23.1.0**, matching our pinned `nx`/`@nx/js` exactly, so adopting it needs no Nx version movement.
- **Versions available**: `vitest` 4.1.10, requiring `vite` ^6/^7/^8 (latest 8.1.5) and `@types/node` >=24 (we run 26). No conflicts with the current tree.

## Open Questions

- Shared config as a workspace package (`packages/vitest/`) mirroring today's `@cohbrgr/jest`, or a single root `vitest.workspace.ts`? The package approach matches the existing convention; the workspace file is less boilerplate. The 14 nested configs push toward the workspace file.
- Coverage provider: `v8` (no instrumentation, fast) vs `istanbul` (matches current jest coverage semantics more closely). Does anything consume the coverage output (e.g. a threshold gate)?
- Adopt `@nx/vite` for caching/affected, or keep the current thin `test` script per package? The thin script is what exists today and works; `@nx/vite` is available if we want the tighter integration.
- Sequencing vs the deferred react-router 8 work: land Vitest fully first, or migrate the shell suites and react-router 8 together since they touch the same SSR render tests?
