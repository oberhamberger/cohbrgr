# Deployment

This document covers how to build and deploy the cohbrgr applications.

## Production Build

Build all applications for production:

```bash
pnpm run build
```

Each app outputs to its own `dist/` directory:

```
apps/shell/dist/
apps/content/dist/
apps/api/dist/
```

## Running Production Builds

### Local Production Server

After building, serve all apps:

```bash
pnpm run serve
```

Or serve individual apps:

```bash
pnpm run serve:shell
pnpm run serve:content
pnpm run serve:api
```

## Docker

Each application can be containerized for deployment.

### Building Docker Images

Build images for each app:

```bash
# Shell application
docker build -t cohbrgr-shell -f apps/shell/Dockerfile .

# Content application
docker build -t cohbrgr-content -f apps/content/Dockerfile .

# API application
docker build -t cohbrgr-api -f apps/api/Dockerfile .
```

### Running Containers

Run individual containers:

```bash
docker run -d -p 3000:3000 cohbrgr-shell
docker run -d -p 3001:3001 cohbrgr-content
docker run -d -p 3002:3002 cohbrgr-api
```

### Docker Compose

For local multi-container deployment, use Docker Compose:

```bash
docker-compose up
```

This starts all three applications with proper networking between them.

To rebuild images and start:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d
```

## Environment Variables

Applications read configuration from environment variables at **build time**. Each app has an `env/` directory with configuration that gets inlined during bundling via Rspack's DefinePlugin.

| Variable    | Description                       | Default       | Build-time |
| ----------- | --------------------------------- | ------------- | ---------- |
| `NODE_ENV`  | Environment mode (dev/production) | `development` | Yes        |
| `CLOUD_RUN` | Deploying to GCP Cloud Run        | `false`       | Yes        |

### Build-time vs Runtime

These variables are read during the build process and inlined into the bundle:

```typescript
// apps/*/env/index.ts
const isProduction = process.env.NODE_ENV === 'production';
const isCloudRun = process.env.CLOUD_RUN === 'true';

export const Config = isCloudRun
    ? internalConfig.cloudRun
    : internalConfig.local;
```

This means:

- `pnpm run build` → `NODE_ENV=production`, `CLOUD_RUN` unset → local production config
- `CLOUD_RUN=true pnpm run build` → Cloud Run config with cloud URLs

### Configuration Per Environment

| Environment      | NODE_ENV    | CLOUD_RUN | API URL                           |
| ---------------- | ----------- | --------- | --------------------------------- |
| Local dev        | development | -         | `http://localhost:3032`           |
| Local production | production  | -         | `http://localhost:3002`           |
| Cloud Run        | production  | `true`    | `https://cohbrgr-api-....run.app` |

## CI/CD

The project uses GitHub Actions for continuous integration.

### Triggers

| Branch    | Action                            |
| --------- | --------------------------------- |
| `develop` | Run CI checks (lint, test, build) |
| `main`    | Deploy to production              |

### Pipeline Steps

1. Install dependencies (`pnpm install`)
2. Run linting (`pnpm run lint`)
3. Run tests (`pnpm run test`)
4. Build all apps (`pnpm run build`)
5. (main only) Deploy

## Pre-Deployment Verification

Run the integration test suite to verify all apps work together before deploying:

```bash
pnpm run test:integration
```

This builds all apps in production mode, starts them on ports 3000/3001/3002, and runs 16 smoke tests covering health checks, API endpoints, SSR, security headers, and correlation ID propagation.

## Health Checks

Each application exposes a health endpoint:

```bash
curl http://localhost:3000/health  # shell (production)
curl http://localhost:3001/health  # content (production)
curl http://localhost:3002/health  # api (production)
```

The shell app also proxies a content health check at `/content-health`, which is used by the client to verify the content micro-frontend is available before attempting to load it.

Use these for container orchestration health checks and load balancer configuration.

## Observability

### Correlation IDs

All apps automatically generate a `x-correlation-id` header for each request. If an incoming request includes this header, the ID is propagated. Correlation IDs appear in:

- Log output (as `correlationId` field in JSON logs)
- Error responses (`{ "error": "Internal Server Error", "correlationId": "..." }`)
- Response headers (`x-correlation-id`)

### Structured Logging

In production, all apps output structured JSON logs via Winston. In development, logs use colorized text format.

### Rate Limiting

All three apps have rate limiting enabled in production (500 requests per 10-minute window per IP).
