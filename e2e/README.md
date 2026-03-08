# E2E Tests

Browser-based end-to-end tests using [Playwright](https://playwright.dev/), running against all three apps (shell, content, api) in production mode.

## Prerequisites

Build all packages before running tests locally:

```bash
pnpm run build
```

## Running Tests

```bash
# Run against local servers (headless)
pnpm run test:e2e

# Run with interactive UI
pnpm run test:e2e:ui

# Run against production
pnpm run test:e2e:prod
```

When running locally, Playwright automatically starts all three servers before tests and stops them after. If servers are already running on the expected ports, they are reused.

When running against production (`E2E_BASE_URL`), no local servers are started. Tests that rely on internal endpoints (e.g. content app health) are skipped.

## Test Suites

| Spec                    | What it covers                                                           |
| ----------------------- | ------------------------------------------------------------------------ |
| `ssr.spec.ts`           | Status codes, title, canonical link, meta viewport, CSP nonce on scripts |
| `navigation.spec.ts`    | Federated navigation renders, 404 page, offline page                     |
| `federation.spec.ts`    | Content loads from remote, content app health endpoint                   |
| `security.spec.ts`      | CSP header, X-Content-Type-Options, correlation IDs, nonce uniqueness    |
| `no-javascript.spec.ts` | SSR output without client-side JavaScript                                |

## Configuration

- **Browser:** Chromium only
- **Base URL:** `http://localhost:3000` (overridable via `E2E_BASE_URL`)
- **Retries:** 1 in CI, 0 locally
- **Traces:** captured on first retry
- **Reporter:** HTML locally, GitHub reporter in CI
