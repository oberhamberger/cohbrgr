# TODO

## Testing & Quality

- [x] Increase unit test coverage — added content-health and FederatedContent tests, shell coverage 70% → 96%
- [ ] Run e2e tests against production (`pnpm run test:e2e:prod`) to validate deployment
- [ ] Add Lighthouse CI (`lhci autorun`) to the local `integration` script (needs `lighthouserc` config and `@lhci/cli` dependency first)

## Performance & Production

- [x] Review bundle size — ~123K gzipped total JS, no bloat identified
- [ ] Evaluate streaming SSR (`onShellReady` instead of `onAllReady`) for faster TTFB — blocked by `HttpStatus` pattern which requires reading status code after full render
- [x] Review cache headers — hashed static files get `immutable` + 1 year; SSR pages get `stale-while-revalidate=86400`
- [x] Add `/health` endpoint to the shell app — already provided by `createApp` in `@cohbrgr/server`

## Architecture

- [ ] Upgrade ESLint 9 → 10
- [ ] Upgrade `@module-federation/enhanced` 0.23 → 2.1
- [x] Add a styled 500 error page for SSR failures — render middleware catches errors and sends styled HTML

## Developer Experience

- [x] Review pre-commit hook — runs prettier on staged files only (fast); lint + test deferred to CI
- [ ] Set up GitHub Actions CI workflow (no workflow files exist yet)
