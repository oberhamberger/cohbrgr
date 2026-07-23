# Unit Testing

This document covers the testing setup and practices for the cohbrgr project.

## Overview

The project uses [Vitest](https://vitest.dev) for unit testing. Tests are written alongside source files using the `.spec.ts` or `.spec.tsx` extension, or inside `__tests__` directories for server code.

Vitest runs tests as native ESM, which is why it replaced Jest: the runner no longer needs a CommonJS transform step, so ESM-only dependencies work without babel shims.

## Running Tests

Run all tests across the monorepo:

```bash
pnpm run test
```

Run tests for a specific package:

```bash
pnpm run test:components
```

Run tests with coverage (within a package or app directory):

```bash
cd apps/api && npx vitest run --coverage
cd packages/components && npx vitest run --coverage
```

Run tests in watch mode (omit `run`):

```bash
cd packages/components
npx vitest
```

## Configuration

### Base Configuration

The `@cohbrgr/vitest` package provides the shared configuration and the `vitest` binary that each package's `test` script invokes. It exposes two helpers:

- `defineProject` — a single test project
- `defineProjects` — composes several projects into one suite (for apps with client and server code)

Globals are **not** enabled. Spec files import what they use from `vitest`:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';
```

This is deliberate. Ambient globals require a `types` entry, which only applies to files owned by a tsconfig that declares it — but most packages exclude their specs from `tsconfig.json`, so editors fall back to an inferred project and flag every global as undefined. Explicit imports resolve the same way everywhere, in the editor and in the runner.

Path aliases are read from each package's own `tsconfig.json` via Vite's native `resolve.tsconfigPaths`, so module resolution always matches what `tsc` does.

### Package Configuration

Each testable package has a `vitest.config.ts`:

```typescript
// packages/components/vitest.config.ts
import { defineProject } from '@cohbrgr/vitest';

export default defineProject({
    name: 'components',
    environment: 'jsdom',
    root: 'src',
});
```

### Multi-Project Setup

Apps with both client and server code compose several projects:

```typescript
// apps/shell/vitest.config.ts
import { defineProjects } from '@cohbrgr/vitest';

export default defineProjects({
    projects: [
        'src/client/vitest.config.ts',
        'src/server/vitest.config.ts',
        'env/vitest.config.ts',
    ],
    coverage: {
        include: ['src/**/*.{ts,tsx}', 'env/**/*.ts'],
        exclude: ['src/**/*.spec.{ts,tsx}' /* ... */],
    },
});
```

Each sub-project resolves its own `root` from its file location:

```typescript
// apps/shell/src/client/vitest.config.ts
import { fileURLToPath } from 'node:url';

import { defineProject } from '@cohbrgr/vitest';

export default defineProject({
    name: 'client',
    root: fileURLToPath(new URL('.', import.meta.url)),
    environment: 'jsdom',
});
```

The absolute path matters: Vitest resolves a project's `root` against the **parent config's** root, not against the project config's own location, so a relative string like `'./../../'` silently escapes to the wrong directory.

### Coverage Exclusions

Some files are excluded from coverage because they:

- **Entry points with side effects**: `index.ts`, `bootstrap.tsx`, `server-entry.ts` - execute immediately on import
- **Browser-only code**: Service workers, client hydration
- **Error handlers**: React SSR error callbacks that require triggering rendering failures
- **File system catch blocks**: Defensive error handling for missing files

## Test Environments

| Code Type        | Environment | When to Use                                |
| ---------------- | ----------- | ------------------------------------------ |
| React components | `jsdom`     | Testing DOM interactions, hooks, rendering |
| Server code      | `node`      | Testing Express middleware, utilities      |
| Pure functions   | `node`      | Testing utilities, helpers                 |

Projects declaring `environment: 'jsdom'` automatically load a shared setup file that registers the `@testing-library/jest-dom` matchers and runs Testing Library's `cleanup` after each test, so individual spec files never do either. (Testing Library only self-registers that cleanup when a global `afterEach` exists, which it does not here.)

## File Organization

Test files live alongside the code they test:

```
src/
├── components/
│   ├── Spinner.tsx
│   └── Spinner.spec.tsx
└── utils/
    ├── helpers.ts
    └── helpers.spec.ts
```

For server code with `__tests__` directories:

```
src/server/
├── middleware/
│   ├── render.tsx
│   └── __tests__/
│       └── render.spec.ts
```

## Writing Tests

### React Components

```typescript
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('Spinner', () => {
    it('renders with default props', () => {
        render(<Spinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
```

### Express Middleware

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NextFunction, Request, Response } from 'express';

import { errorHandler } from './error';

describe('errorHandler', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    it('sends 500 status for errors', () => {
        errorHandler(
            new Error('Test error'),
            {} as Request,
            mockResponse as Response,
            vi.fn() as NextFunction,
        );
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});
```

### Environment Configuration

Re-evaluating a module under different environment variables uses `vi.resetModules()` plus a dynamic `import()`. There is no synchronous `require()` in ESM, so the test must be `async`:

```typescript
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('env config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('uses local config when CLOUD_RUN is not set', async () => {
        delete process.env['CLOUD_RUN'];
        const { Config } = await import('./index');
        expect(Config.location).toBe('http://localhost');
    });
});
```

## Mocking

### Module Mocks

```typescript
import { vi } from 'vitest';

vi.mock('@cohbrgr/server', () => ({
    logging: vi.fn(() => vi.fn()),
    methodDetermination: vi.fn(),
}));
```

### Partial Mocks

`vi.importActual` returns a promise, so any factory that spreads the real module must be `async`:

```typescript
vi.mock('@cohbrgr/server', async () => ({
    ...(await vi.importActual<typeof import('@cohbrgr/server')>(
        '@cohbrgr/server',
    )),
    sendJsonWithEtag: vi.fn(),
}));
```

### Mocking JSON

A mock factory returns the **module namespace**, so JSON fixtures must be nested under `default`:

```typescript
vi.mock('data/navigation.json', () => ({
    default: { hero: { nodes: [] } },
}));
```

### Typing Mocks

`Mock` is a named export, not a namespace:

```typescript
import type { Mock } from 'vitest';

(navigationService.get as Mock).mockReturnValue(navigationData);
```

### Asset Stubs

CSS, images, and other assets are handled by Vite natively — no stub transformer is configured.

### Express Request/Response Mocks

For more complex Express testing, use `node-mocks-http`:

```typescript
import httpMocks from 'node-mocks-http';

const mockRequest = httpMocks.createRequest({
    method: 'GET',
    url: '/api/test',
});
const mockResponse = httpMocks.createResponse();
```

## Adding Tests to a New Package

1. Add `@cohbrgr/vitest` as a dev dependency:

    ```bash
    pnpm add -D @cohbrgr/vitest
    ```

2. Create `vitest.config.ts`:

    ```typescript
    import { defineProject } from '@cohbrgr/vitest';

    export default defineProject({
        name: 'my-package',
        environment: 'node', // or 'jsdom' for React
        root: 'src',
    });
    ```

3. Add the test script to `package.json`:

    ```json
    {
        "scripts": {
            "test": "vitest run"
        }
    }
    ```

4. Update `tsconfig.json` to exclude test files from the build:

    ```json
    {
        "exclude": ["dist", "node_modules", "vitest.config.ts", "**/*.spec.ts"]
    }
    ```

5. Update `eslint.config.mjs` to ignore test files:

    ```javascript
    import config from '@cohbrgr/eslint';

    export default [
        ...config,
        { ignores: ['vitest.config.ts', '**/*.spec.ts'] },
    ];
    ```
