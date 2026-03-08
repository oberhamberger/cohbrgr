# TODO

## Testing & Quality

- [x] Increase unit test coverage — added content-health and FederatedContent tests, shell coverage 70% → 96%
- [ ] Run e2e tests against production — requires deployment notification/polling (Cloud Run deploy takes ~10min with no completion callback)
- [ ] Add Lighthouse CI — needs `@lhci/cli` dependency and `lighthouserc` config

## Performance & Production

- [x] Review bundle size — ~123K gzipped total JS, no bloat identified
- [ ] Evaluate streaming SSR (`onShellReady` instead of `onAllReady`) for faster TTFB — `HttpStatus` sets status during render; since it's outside Suspense boundaries, it should be available at shell-ready, but needs validation
- [x] Review cache headers — hashed static files get `immutable` + 1 year; SSR pages get `stale-while-revalidate=86400`
- [x] Add `/health` endpoint to the shell app — already provided by `createApp` in `@cohbrgr/server`

## Architecture

- [ ] Upgrade `@module-federation/enhanced` 0.23 → 2.1
- [x] Add a styled 500 error page for SSR failures — render middleware catches errors and sends styled HTML

## Developer Experience

- [x] Review pre-commit hook — runs prettier on staged files only (fast); lint + test deferred to CI
- [x] Set up GitHub Actions CI workflow — updated pnpm version, added integration test and e2e jobs
