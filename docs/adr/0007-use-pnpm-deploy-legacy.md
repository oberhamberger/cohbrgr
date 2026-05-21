# 0007 - Use `pnpm deploy --legacy` for App Docker Images

**Status:** Accepted
**Date:** 2026-05-21

## Context

The three app Dockerfiles (`apps/{shell,content,api}/Dockerfile`) use `pnpm deploy` to materialize a standalone production tree containing the app and its workspace dependencies. The semantics of `pnpm deploy` changed across recent pnpm versions:

- **pnpm v9 and earlier**: `pnpm deploy` always materialized workspace deps into a standalone folder. No opt-in needed.
- **pnpm v10+**: requires `inject-workspace-packages=true` (in `.npmrc` or via `--legacy` per command). The new philosophy is that workspace deps are hardlinked into each consumer's `node_modules` in the same shape as a published npm package, eliminating the dev/prod divergence where dev resolves through a workspace symlink into source but prod resolves through a built `dist/`.
- **pnpm v11**: tightened further. The env-var hack (`NPM_CONFIG_INJECT_WORKSPACE_PACKAGES=true`) no longer works; the config must come from a file.

We are on pnpm v11. We need a way to build deployable production trees without rewiring the entire workspace.

## Decision

We will use `pnpm deploy --legacy` in the three app Dockerfiles. The `--legacy` flag opts into the v9-and-earlier semantics per command, without requiring `inject-workspace-packages=true` in the root `.npmrc`.

This is a deliberate, scoped use of a legacy code path. The full migration to injected workspace packages is documented below as the path we would take if `--legacy` is removed.

## Consequences

### Positive

- Dockerfiles work today on pnpm v11 with no other workspace changes
- Dev workflow stays simple: workspace symlinks, immediate HMR, no rebuild-and-reinstall cycle
- Nx remains the sole orchestrator of package builds; no two-orchestrator race on `dist/` outputs
- `packages/components` and `packages/jest` can keep exporting `./src/index.ts` directly

### Negative

- We're using a code path pnpm has signaled as legacy. If a future pnpm release removes `--legacy`, deploys break until we migrate
- The dev/prod divergence (dev resolves through source symlinks, prod through `pnpm deploy`'s materialized tree) persists. A bug that reproduces only in Docker is theoretically possible
- The migration cost only grows as more workspace packages are added

## Trigger to Revisit

Migrate off `--legacy` if any of these happen:

- pnpm announces removal of `--legacy` (watch release notes)
- A production bug reproduces in Docker but not in dev, traceable to the symlink-vs-materialized divergence
- The friction inventory below shrinks (e.g. Nx stops owning package builds for other reasons, or `packages/components` gets a real build step for other reasons)

## Alternatives Considered

### Migrate to injected workspace packages now

The "modern" pnpm v10+ setup. Would require:

1. Root `.npmrc`: `inject-workspace-packages=true`
2. Every built workspace package gets a `prepublishOnly` so pnpm builds it before injecting:
    - `packages/build/package.json` -> `"prepublishOnly": "tsc"`
    - `packages/env/package.json` -> `"prepublishOnly": "tsc"`
    - `packages/localization/package.json` -> `"prepublishOnly": "tsc"`
    - `packages/server/package.json` -> `"prepublishOnly": "tsc"`
    - `packages/utils/package.json` -> `"prepublishOnly": "tsc"`
    - `packages/figma/package.json` -> `"prepublishOnly": "style-dictionary build"`
    - `packages/components/package.json` needs a build step added (currently exports `./src/index.ts`)
    - `packages/jest/package.json` needs a build step added (currently exports `./index.ts`)
3. Drop `--legacy` from the three Dockerfiles

Not chosen because:

- **Install becomes a topological build.** Every `pnpm install` runs the full `prepublishOnly` chain. Cold install goes from ~15s to potentially minutes
- **Nx and pnpm both build packages.** Today `pnpm run build:shell` -> `nx build` walks the dep graph. With injection, `pnpm install` also builds them. Two orchestrators racing on the same `dist/` outputs; reconciling means stripping package builds from Nx project configs and letting pnpm own them, which is non-trivial rework
- **Dev workflow regresses.** Today `pnpm run dev` works because rspack follows a workspace symlink into `packages/utils/src/` and HMR sees edits live. With injection, `node_modules/@cohbrgr/utils/dist/index.js` is a hardlink to a built file. Editing `src/foo.ts` requires rebuilding utils, but tsc atomic-renames (new inode) which severs the hardlink, so the consumer keeps the old file. Either accept the rebuild-then-reinstall cycle, or add dev-only rspack source aliases (which reintroduces the very dev/prod divergence injection was meant to eliminate)
- **Two packages export raw `.ts`.** `components` and `jest` would need proper build steps before they can be injected cleanly

Estimated scope:

| File                                          | Change                               |
| --------------------------------------------- | ------------------------------------ |
| `.npmrc` (new)                                | `inject-workspace-packages=true`     |
| 6 × `packages/*/package.json`                 | add `prepublishOnly`                 |
| 2 × `packages/{components,jest}/package.json` | add proper build step                |
| 3 × `apps/*/Dockerfile`                       | drop `--legacy`                      |
| `nx.json` / project configs                   | reconcile package builds with pnpm   |
| `apps/*/rspack.*.mts`                         | possibly add dev-only source aliases |

Roughly a couple of days end-to-end.

### Pin pnpm to v9

Avoid the problem entirely by not upgrading. Not chosen because pnpm v10+ brings real improvements (faster installs, better lockfile handling) and v9 is already on a deprecation path.

### Hand-roll a deploy step instead of `pnpm deploy`

Write a script that copies the app and its workspace deps into a standalone folder. Not chosen because `pnpm deploy --legacy` already does this correctly; rebuilding it ourselves trades a supported-but-legacy upstream feature for unsupported custom code.
