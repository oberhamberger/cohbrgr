# Unit Testing

This document covers the testing setup and practices for the cohbrgr project.

## Overview

The project uses Jest for unit testing with TypeScript support via ts-jest. Tests are written alongside source files using the `.spec.ts` or `.spec.tsx` extension.

## Running Tests

Run all tests across the monorepo:

```bash
pnpm run test
```

Run tests for a specific package:

```bash
pnpm run test:components
pnpm run test:server
pnpm run test:utils
```

Run tests with coverage (within a package directory):

```bash
cd apps/api && npx jest --coverage
cd packages/components && npx jest --coverage
```

Run tests in watch mode:

```bash
cd packages/components
npx jest --watch
```

## Configuration

### Base Configuration

The `@cohbrgr/jest` package provides the base configuration that all packages extend:

```typescript
// packages/jest/index.ts
export default {
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|scss)$': 'jest-transform-stub',
        '\\.(jpg|jpeg|png|svg)$': 'jest-transform-stub',
    },
};
```

### Package Configuration

Each testable package has its own `jest.config.ts` that extends the base:

```typescript
// packages/components/jest.config.ts
import baseConfig from '@cohbrgr/jest';

export default {
    ...baseConfig,
    displayName: 'components',
    testEnvironment: 'jsdom',
    rootDir: '.',
    testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
};
```

### Multi-Project Setup

Apps with both client and server code use Jest's multi-project feature:

```typescript
// apps/shell/jest.config.ts
export default {
    projects: [
        'src/client/jest.config.ts',
        'src/server/jest.config.ts',
        'env/jest.config.ts',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'env/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/jest.config.ts',
        '!src/**/*.spec.{ts,tsx}',
        // Entry points with side effects
        '!src/client/index.ts',
        '!src/client/bootstrap.tsx',
        '!src/server/index.ts',
    ],
};
```

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

## File Organization

Test files live alongside the code they test:

```
src/
├── components/
│   ├── Spinner.tsx
│   └── Spinner.spec.tsx
├── contexts/
│   ├── http.tsx
│   └── http.spec.tsx
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
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

describe('Spinner', () => {
    it('renders with default props', () => {
        render(<Spinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has correct displayName', () => {
        expect(Spinner.displayName).toBe('Spinner');
    });
});
```

### React Context Providers

```typescript
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';

import { HttpContext, HttpProvider, HttpStatus } from './http';

const TestConsumer = () => {
    const context = useContext(HttpContext);
    return <span data-testid="status">{context?.statusCode ?? 'none'}</span>;
};

describe('HttpProvider', () => {
    it('provides context values to children', () => {
        render(
            <HttpProvider context={{ statusCode: 200 }}>
                <TestConsumer />
            </HttpProvider>,
        );
        expect(screen.getByTestId('status')).toHaveTextContent('200');
    });
});
```

### Express Middleware

```typescript
import type { NextFunction, Request, Response } from 'express';

import { errorHandler } from './error';

describe('errorHandler', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = { method: 'GET', path: '/api/test' };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    it('sends 500 status for errors', () => {
        const error = new Error('Test error');
        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});
```

### Utilities with Process Arguments

```typescript
import { findProcessArgs } from './findProcessArgs';

describe('findProcessArgs', () => {
    it('returns the value for existing arg', () => {
        const args = ['--port', '3000', '--verbose'];
        expect(findProcessArgs('--port', args)).toBe('3000');
    });

    it('returns true for flag without value', () => {
        const args = ['--verbose'];
        expect(findProcessArgs('--verbose', args)).toBe(true);
    });

    it('returns undefined for missing arg', () => {
        expect(findProcessArgs('--missing', [])).toBeUndefined();
    });
});
```

### Environment Configuration

```typescript
describe('env config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('uses local config when DOCKER is not set', () => {
        delete process.env['DOCKER'];
        const { Config } = require('./index');
        expect(Config.location).toBe('http://localhost');
    });

    it('uses docker config when DOCKER is set', () => {
        process.env['DOCKER'] = 'true';
        const { Config } = require('./index');
        expect(Config.location).toContain('run.app');
    });
});
```

## Mocking

### Module Mocks

```typescript
jest.mock('@cohbrgr/server', () => ({
    logging: jest.fn(() => jest.fn()),
    methodDetermination: jest.fn(),
}));
```

### Asset Stubs

CSS, images, and other assets are automatically stubbed via `jest-transform-stub` in the base configuration.

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

1. Add `@cohbrgr/jest` as a dev dependency:
   ```bash
   pnpm add -D @cohbrgr/jest
   ```

2. Create `jest.config.ts`:
   ```typescript
   import type { JestConfigWithTsJest } from 'ts-jest';
   import baseConfig from '@cohbrgr/jest';

   const config: JestConfigWithTsJest = {
       ...baseConfig,
       displayName: 'my-package',
       testEnvironment: 'node', // or 'jsdom' for React
       rootDir: '.',
   };

   export default config;
   ```

3. Add test script to `package.json`:
   ```json
   {
       "scripts": {
           "test": "jest"
       }
   }
   ```

4. Update `tsconfig.json` to exclude test files from build:
   ```json
   {
       "exclude": ["dist", "node_modules", "jest.config.ts", "**/*.spec.ts"]
   }
   ```

5. Update `eslint.config.mjs` to ignore test files:
   ```javascript
   import config from '@cohbrgr/eslint';

   export default [
       ...config,
       { ignores: ['jest.config.ts', '**/*.spec.ts'] },
   ];
   ```
