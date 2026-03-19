---
name: verify
description: Run the full CI verification pipeline locally before pushing
disable-model-invocation: true
---

# Pre-Push Verification

Run the same checks that GitHub Actions runs. Stop on first failure.

## Pipeline

Run these in order. If any step fails, stop and report which step failed and why.

1. `pnpm run build` — build all packages and apps
2. `pnpm run lint` — ESLint across all projects (warnings OK, errors fail)
3. `pnpm run test` — all unit tests
4. `pnpm run test:integration` — build, start all apps, run smoke tests

## On failure

- Identify which package or app failed
- Show the relevant error output
- Suggest a fix if obvious
