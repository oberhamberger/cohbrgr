# `@cohbrgr/server`

This package provides a collection of reusable server-side middleware functions for Express.js applications within the Cohbrgr monorepo.

## Overview

This package centralizes common server-side concerns such as logging and HTTP method validation, promoting consistency and reusability across different server-side applications.

## Middleware Functions

### `logging(isProduction: boolean)`

A middleware function that logs incoming HTTP requests.

-   **`isProduction`**: A boolean flag that determines the logging behavior:
    -   If `false` (development environment), it logs the requested URL (e.g., `Requesting: /api/data`).
    -   If `true` (production environment), it logs the client's IP address and the requested URL (e.g., `192.168.1.100 requests: /api/data`).

#### Usage

```typescript
import { logging } from '@cohbrgr/server';
import express from 'express';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(logging(isProduction));

// ... other routes and middleware
```

### `methodDetermination`

A middleware function that enforces allowed HTTP methods for incoming requests. It currently only permits `GET` and `HEAD` requests.

-   If an incoming request uses any method other than `GET` or `HEAD`, it logs a warning, sends a `405 Method Not Allowed` HTTP status code, and terminates the request processing.

#### Usage

```typescript
import { methodDetermination } from '@cohbrgr/server';
import express from 'express';

const app = express();

app.use(methodDetermination);

// ... other routes and middleware
```
