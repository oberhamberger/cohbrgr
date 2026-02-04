# TODO

## Medium Priority

- [ ] Resolve HttpStatus + Suspense TODO (`apps/shell/src/client/contexts/http.tsx:28-29`) - the comment notes Suspense-based SSR may not work properly; verify behavior and implement a proper solution
- [ ] Unify TypeScript configurations - shell and content apps have divergent `tsconfig.json` settings (`jsx`, `module`, `lib`); create consistent inheritance from the shared base
- [ ] Pin pnpm version in Dockerfile (`Dockerfile:15`) - currently uses `pnpm@latest` instead of matching the pinned `pnpm@10.28.2`
- [ ] Uncomment and configure pre-commit hook (`.husky/pre-commit`) - Prettier formatting is not enforced before commits
- [ ] Replace `console.log` Web Vitals logging with analytics endpoint (`apps/shell/src/client/App.tsx:17-20`) - metrics are logged to console in production
- [ ] Use `Logger.warn()` instead of `Logger.log('warn', ...)` in rate limiter (`packages/server/src/middleware/rateLimit.ts:44-46`)
- [ ] Add CORS origin URL validation in `createApp` (`packages/server/src/app/createApp.ts`) - origins are passed directly without validation
- [ ] Synchronize root `package.json` version (v1.0.0) with app/package versions (v2.0.1), or document the versioning strategy

## Low Priority

- [ ] Add integration tests for Module Federation boundary conditions (remote component loading failures, version mismatches, network timeouts)
- [ ] Implement distributed tracing with correlation IDs across shell/content/api services for easier log correlation
- [ ] Add structured logging (JSON format) and file transport to the logger for production (`packages/utils/src/logger.ts`)
- [ ] Improve error middleware to include correlation IDs in responses for production debugging (`packages/server/src/middleware/error.ts`)
- [ ] Apply rate limiting consistently across content and API apps (currently only shell has it)
- [ ] Add health checks before Module Federation component loads to verify content/api availability
