---
name: update-deps
description: Update dependencies across the monorepo in tiers with verification
disable-model-invocation: true
---

# Update Dependencies

Update all dependencies across the monorepo. Work in tiers to catch breakage early.

## Steps

1. Run `pnpm outdated -r` to see what needs updating.
2. Summarize the outdated packages to the user, grouped by severity:
    - **Safe** — patch and minor updates
    - **Major** — major version bumps (flag these, do not auto-apply)
3. Wait for user confirmation before proceeding.

## Update tiers

Apply safe (patch/minor) updates in this order, verifying after each tier:

### Tier 1 — Root & shared configs

- Root devDependencies (TypeScript, Nx, types, husky, commitlint)
- Shared config packages: `@cohbrgr/tsconfig`, `@cohbrgr/prettier`, `@cohbrgr/eslint`
- Catalog versions in `pnpm-workspace.yaml` (`@rspack/cli`, `@rspack/core`)
- **Verify:** `pnpm run build && pnpm run lint && pnpm run test`

### Tier 2 — Build toolchain

- `@cohbrgr/build`: `@swc/core`, `@module-federation/*`, `@rsdoctor/*`, `sass`, `sass-embedded`, `sass-loader`, `webpack-merge`
- **Verify:** `pnpm run build`

### Tier 3 — Shared runtime packages

- `@cohbrgr/server`: `express`, `helmet`, `cors`, `compression`, `express-rate-limit`
- `@cohbrgr/utils`: `winston`
- `@cohbrgr/figma`: `style-dictionary`
- `@cohbrgr/components`, `@cohbrgr/localization`
- `@cohbrgr/jest`: `jest`, `ts-jest`, `@testing-library/*`
- **Verify:** `pnpm run build && pnpm run test`

### Tier 4 — Applications

- `apps/shell`: `@tanstack/react-query`, `workbox-*`, `web-vitals`
- `apps/content`: `@tanstack/react-query`
- `apps/api`
- Root React / React Router
- **Verify:** `pnpm run build && pnpm run test && pnpm run test:integration`

### Tier 5 — E2E & dev tooling

- `e2e`: `@playwright/test` (may need `npx playwright install`)
- **Verify:** `pnpm run test:integration`

## Rules

- All versions in this repo are pinned (no ^ or ~). Edit exact versions in each package.json.
- Catalog entries in `pnpm-workspace.yaml` must be bumped manually.
- Run `pnpm install` after editing package.json files.
- If a tier fails verification, stop and report. Do not continue to the next tier.
- For major bumps, present changelogs and risk areas. Let the user decide.

## Risk areas

- **Rspack / Module Federation** — tightly coupled, update together
- **Nx** — major bumps often need `npx nx migrate latest`
- **React Router** — check for breaking changes in SSR behavior
