# Unit Testing

This document covers the testing setup and practices for the cohbrgr project.

## Overview

The project uses Jest for unit testing with TypeScript support via ts-jest.

## Running Tests

Run all tests across the monorepo:

```bash
pnpm run test
```

Run tests for a specific package:

```bash
pnpm run test:components
```

Run tests in watch mode (within a package directory):

```bash
cd packages/components
pnpm test -- --watch
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

Apps with both client and server code (shell, content) use Jest's multi-project feature:

```typescript
// apps/shell/jest.config.ts
export default {
    projects: ['./src/client/jest.config.ts', './src/server/jest.config.ts'],
};
```

## Test Environments

| Code Type        | Environment | When to Use                                |
| ---------------- | ----------- | ------------------------------------------ |
| React components | `jsdom`     | Testing DOM interactions, hooks, rendering |
| Server code      | `node`      | Testing Express middleware, utilities      |
| Pure functions   | `node`      | Testing utilities, helpers                 |

## File Naming

Test files use the `.spec.ts` or `.spec.tsx` extension and live alongside the code they test:

```
src/
├── components/
│   ├── Spinner.tsx
│   └── Spinner.spec.tsx
└── utils/
    ├── helpers.ts
    └── helpers.spec.ts
```

## Writing Tests

### React Components

```typescript
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
import { NextFunction, Request, Response } from 'express';

import { loggingMiddleware } from './logging';

describe('loggingMiddleware', () => {
    it('calls next()', () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        loggingMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
```

### Utilities

```typescript
import { findProcessArgs } from './findProcessArgs';

describe('findProcessArgs', () => {
    it('returns undefined for missing arg', () => {
        const result = findProcessArgs('--missing', []);
        expect(result).toBeUndefined();
    });
});
```

## Mocking

### Module Mocks

```typescript
jest.mock('@cohbrgr/utils', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));
```

### Asset Stubs

CSS, images, and other assets are automatically stubbed via `jest-transform-stub` in the base configuration.

## Coverage

Generate coverage reports:

```bash
pnpm test -- --coverage
```

Coverage reports are output to `coverage/` in each package.
