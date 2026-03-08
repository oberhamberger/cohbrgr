# @cohbrgr/server

This package provides reusable server-side middleware and utilities for Express.js applications within the cohbrgr monorepo.

## Installation

```bash
pnpm add @cohbrgr/server
```

## Exports

| Export                  | Type       | Description                 |
| ----------------------- | ---------- | --------------------------- |
| `logging`               | Middleware | Request logging             |
| `methodDetermination`   | Middleware | HTTP method validation      |
| `errorHandler`          | Middleware | Global error handling       |
| `healthRoutes`          | Router     | Health check endpoint       |
| `gracefulStartAndClose` | Function   | Server lifecycle management |

## Middleware

### `logging(isProduction: boolean)`

Logs incoming HTTP requests with different formats for development and production.

- **Development**: Logs the requested URL (e.g., `Requesting: /api/data`)
- **Production**: Logs client IP and URL (e.g., `192.168.1.100 requests: /api/data`)

```typescript
import express from 'express';

import { logging } from '@cohbrgr/server';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(logging(isProduction));
```

### `methodDetermination`

Restricts allowed HTTP methods to `GET` and `HEAD`. Returns `405 Method Not Allowed` for other methods.

```typescript
import express from 'express';

import { methodDetermination } from '@cohbrgr/server';

const app = express();
app.use(methodDetermination);
```

### `errorHandler`

Express error-handling middleware that catches errors, logs them, and returns a 500 response.

```typescript
import express from 'express';

import { errorHandler } from '@cohbrgr/server';

const app = express();

// Mount after all routes
app.use(errorHandler);
```

## Router

### `healthRoutes`

Pre-configured Express router that provides a health check endpoint.

```typescript
import express from 'express';

import { healthRoutes } from '@cohbrgr/server';

const app = express();
app.use('/health', healthRoutes);

// GET /health returns { status: 'ok' }
```

## Utilities

### `gracefulStartAndClose(app, port)`

Starts the Express server and sets up graceful shutdown handlers for `SIGTERM` and `SIGINT` signals.

**Parameters:**

- `app` - Express Application instance
- `port` - Port number to listen on

**Features:**

- Logs server start with environment mode
- Sends `server-ready` message to parent process (useful for process managers)
- Gracefully closes server on termination signals

```typescript
import express from 'express';

import { gracefulStartAndClose } from '@cohbrgr/server';

const app = express();
const port = process.env.PORT || 3000;

// Configure routes...

gracefulStartAndClose(app, Number(port));
```

## Usage Example

Complete server setup using all exports:

```typescript
import express from 'express';

import {
    errorHandler,
    gracefulStartAndClose,
    healthRoutes,
    logging,
    methodDetermination,
} from '@cohbrgr/server';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(logging(isProduction));
app.use(methodDetermination);

// Routes
app.use('/health', healthRoutes);
app.get('/api/data', (req, res) => res.json({ message: 'Hello' }));

// Error handling (must be last)
app.use(errorHandler);

// Start server
gracefulStartAndClose(app, 3000);
```
