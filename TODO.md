# TODO

## High Priority (Cloud Run Deployment)

- [x] CORS policy only allows `localhost:3000` and `cohbrgr.com` — Cloud Run origins are rejected → Fixed: CORS origins now use shared `@cohbrgr/env` constants
- [x] Hardcoded Cloud Run URLs in env files are baked at build time → Fixed: centralised in `@cohbrgr/env` package
- [x] ~~Module Federation remote URLs are hardcoded at build time~~ → Won't fix: only one relevant production environment (Cloud Run), local development uses localhost
- [x] `publicPath` hardcoded to `https://cohbrgr.com/` for Cloud Run builds → Fixed: uses `productionDomain` from `@cohbrgr/env`
- [x] `docker-compose.yml` doesn't pass `PROJECT_ID` build arg to Dockerfiles → Fixed: passes `PROJECT_ID` from host environment

## High Priority

- [x] Pin pnpm version in GitHub Actions setup → Fixed: pinned to `pnpm@10.28.2`
- [x] Fix CSP nonce inconsistency across SSR template components → Fixed: nonce enabled on inline `<style>`, CSP header set after nonce generation, `'unsafe-inline'` removed from `style-src`
- [x] Add ARIA attributes to Spinner component → Fixed: added `role="status"` and `aria-label="Loading"`

## Medium Priority

- [ ] Resolve HttpStatus + Suspense TODO (`apps/shell/src/client/contexts/http.tsx:28-29`) - the comment notes Suspense-based SSR may not work properly; verify behavior and implement a proper solution
- [x] Strengthen logging middleware tests → Fixed: tests now mock `Logger.info` and assert actual log messages for both production and development modes
- [x] Add missing return statements in translation controllers → Fixed: both controllers now explicitly return `sendJsonWithEtag()` result
- [x] Forward actual errors in SSR render middleware → Fixed: `onShellError` and `onError` now forward the original error
- [x] ~~Replace `console.log` Web Vitals logging with analytics endpoint~~ → Won't fix: console logging is intentional, analytics is not a goal of this project
- [x] Add CORS origin URL validation in `createApp` (`packages/server/src/app/createApp.ts`) - origins are passed directly without validation
- [x] Synchronize root `package.json` version (v1.0.0) with app/package versions (v2.0.1) → Fixed: adopted CalVer (YYYY.MM.PATCH) across all packages, added `scripts/version.sh` for unified bumps

## Low Priority

- [x] Add integration tests for Module Federation boundary conditions → Partially addressed: ErrorBoundary wraps federated Content component for graceful degradation on load failures
- [x] Implement distributed tracing with correlation IDs across shell/content/api services → Fixed: `correlationId` middleware generates/propagates `x-correlation-id`, included in logging and error responses
- [x] Add structured logging (JSON format) for production → Fixed: logger uses JSON format in production, colorized text in development
- [x] Improve error middleware to include correlation IDs in responses → Fixed: error responses include `correlationId` when available
- [x] Apply rate limiting consistently across content and API apps → Fixed: enabled `rateLimit: true` in content and API `createApp` calls
- [x] Add health checks before Module Federation component loads → Fixed: `FederatedContent` component checks `/content-health` before loading remote, shell proxies to content app's `/health` endpoint
