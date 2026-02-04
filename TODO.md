# TODO

## High Priority

- [ ] Pin pnpm version in GitHub Actions setup (`.github/actions/setup/action.yml:7`) - uses `npm install -g pnpm` without a version while the project pins `pnpm@10.28.2`
- [ ] Fix CSP nonce inconsistency across SSR template components - `StructuredData.tsx` receives nonce prop but doesn't apply it; `Stylesheets.html.tsx:60` has nonce commented out; only `Javascript.html.tsx:56` uses it correctly
- [ ] Add ARIA attributes to Spinner component (`packages/components/src/spinner/Spinner.tsx:5-11`) - missing `role="status"` and `aria-label` for screen reader support

## Medium Priority

- [ ] Resolve HttpStatus + Suspense TODO (`apps/shell/src/client/contexts/http.tsx:28-29`) - the comment notes Suspense-based SSR may not work properly; verify behavior and implement a proper solution
- [ ] Strengthen logging middleware tests (`packages/server/src/middleware/__tests__/logging.spec.ts:44-62`) - tests only assert `next()` was called, never verify what was actually logged
- [ ] Add missing return statements in translation controllers (`apps/api/src/modules/translation/controller/translation.controller.ts:11-15`) - inconsistent with navigation controllers which return `sendJsonWithEtag()` result
- [ ] Forward actual errors in SSR render middleware (`apps/shell/src/server/middleware/render.tsx:107-120`) - `onShellError` and `onError` reject with generic "Something went wrong" instead of the real error
- [ ] Replace `console.log` Web Vitals logging with analytics endpoint (`apps/shell/src/client/App.tsx:17-20`) - metrics are logged to console in production
- [ ] Add CORS origin URL validation in `createApp` (`packages/server/src/app/createApp.ts`) - origins are passed directly without validation
- [ ] Synchronize root `package.json` version (v1.0.0) with app/package versions (v2.0.1), or document the versioning strategy

## Low Priority

- [ ] Add integration tests for Module Federation boundary conditions (remote component loading failures, version mismatches, network timeouts)
- [ ] Implement distributed tracing with correlation IDs across shell/content/api services for easier log correlation
- [ ] Add structured logging (JSON format) and file transport to the logger for production (`packages/utils/src/logger.ts`)
- [ ] Improve error middleware to include correlation IDs in responses for production debugging (`packages/server/src/middleware/error.ts`)
- [ ] Apply rate limiting consistently across content and API apps (currently only shell has it)
- [ ] Add health checks before Module Federation component loads to verify content/api availability
