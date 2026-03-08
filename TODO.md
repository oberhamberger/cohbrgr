# TODO

## Testing & Quality

- [ ] Increase unit test coverage — run `jest --coverage` across packages to identify gaps
- [ ] Run e2e tests against production (`pnpm run test:e2e:prod`) to validate deployment
- [ ] Add Lighthouse CI (`lhci autorun`) to the local `integration` script

## Performance & Production

- [ ] Review bundle size via `pnpm run build:shell:analyze`
- [ ] Evaluate streaming SSR (`onShellReady` instead of `onAllReady`) for faster TTFB
- [ ] Review cache headers — consider `stale-while-revalidate`, ETags
- [ ] Add `/health` endpoint to the shell app for load balancer/monitoring use

## Architecture

- [ ] Upgrade ESLint 9 → 10
- [ ] Upgrade `@module-federation/enhanced` 0.23 → 2.1
- [ ] Add a styled 500 error page for SSR failures

## Developer Experience

- [ ] Review pre-commit hook — ensure it runs lint + test on staged files only
- [ ] Ensure GitHub Actions CI matches the local `integration` script
