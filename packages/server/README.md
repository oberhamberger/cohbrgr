# @cohbrgr/server

This package provides reusable server-side middleware and utilities for Express.js applications within the cohbrgr monorepo.

## Installation

```bash
pnpm add @cohbrgr/server
```

## Exports

| Export                  | Type       | Description                                   |
| ----------------------- | ---------- | --------------------------------------------- |
| `createApp`             | Function   | Express app factory with common middleware    |
| `correlationId`         | Middleware | Request correlation ID generation/propagation |
| `logging`               | Middleware | Request logging with correlation ID support   |
| `methodDetermination`   | Middleware | HTTP method validation (GET/HEAD only)        |
| `errorHandler`          | Middleware | Global error handling with correlation ID     |
| `cspNonce`              | Middleware | CSP nonce generation                          |
| `applyRateLimit`        | Function   | Rate limiting (production only)               |
| `staticFiles`           | Function   | Static file serving                           |
| `healthRoutes`          | Router     | Health check endpoint                         |
| `gracefulStartAndClose` | Function   | Server lifecycle management                   |

## App Factory

### `createApp(options)`

Creates an Express application with common middleware configured. This is the recommended way to create an app.

Applies middleware in order:

1. Helmet security headers
2. Correlation ID (`x-correlation-id`)
3. Rate limiting (production only, if enabled)
4. nocache (if enabled)
5. Request logging (includes correlation ID)
6. Method determination (GET/HEAD only)
7. Compression (if enabled)
8. Health check endpoint at `/health`

```typescript
import { createApp } from '@cohbrgr/server';

const app = createApp({
    isProduction: true,
    rateLimit: true,
    compression: true,
    nocache: true,
});
```

## Middleware

### `correlationId`

Assigns a unique correlation ID to each request. Uses the incoming `x-correlation-id` header if present, otherwise generates a new UUID. The ID is stored in `res.locals['correlationId']` and set as a response header.

```typescript
import { correlationId } from '@cohbrgr/server';

app.use(correlationId);
```

### `logging(isProduction: boolean)`

Logs incoming HTTP requests with different formats for development and production. Includes the correlation ID when available.

- **Development**: `Requesting: /api/data`
- **Production**: `192.168.1.100 requests: /api/data`

```typescript
import { logging } from '@cohbrgr/server';

app.use(logging(isProduction));
```

### `methodDetermination`

Restricts allowed HTTP methods to `GET` and `HEAD`. Returns `405 Method Not Allowed` for other methods.

```typescript
import { methodDetermination } from '@cohbrgr/server';

app.use(methodDetermination);
```

### `errorHandler`

Express error-handling middleware that catches errors, logs them, and returns a 500 response. Includes the correlation ID in the response body for debugging.

```typescript
import { errorHandler } from '@cohbrgr/server';

// Mount after all routes
app.use(errorHandler);
```

Response format:

```json
{
    "error": "Internal Server Error",
    "correlationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### `cspNonce(usePlaceholder: boolean)`

Generates a CSP nonce for each request, stored in `res.locals['cspNonce']`. Use `usePlaceholder: true` for static site generation.

### `applyRateLimit(app, isProduction, options?)`

Applies rate limiting in production. Defaults to 500 requests per 10-minute window.

## Router

### `healthRoutes`

Pre-configured Express router that provides a health check endpoint.

```typescript
import { healthRoutes } from '@cohbrgr/server';

app.use('/health', healthRoutes);
// GET /health returns { status: 'OK' }
```

## Utilities

### `gracefulStartAndClose(app, port)`

Starts the Express server and sets up graceful shutdown handlers for `SIGTERM` and `SIGINT` signals.

### `sendJsonWithEtag(res, data)`

Sends JSON with an ETag header for conditional caching.
