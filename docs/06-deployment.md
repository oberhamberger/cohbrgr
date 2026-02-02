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
docker run -d -p 3030:3030 cohbrgr-shell
docker run -d -p 3031:3031 cohbrgr-content
docker run -d -p 3032:3032 cohbrgr-api
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

| Variable   | Description                       | Default       | Build-time |
| ---------- | --------------------------------- | ------------- | ---------- |
| `NODE_ENV` | Environment mode (dev/production) | `development` | Yes        |
| `DOCKER`   | Running in Docker/GCP Cloud Run   | `false`       | Yes        |

### Build-time vs Runtime

These variables are read during the build process and inlined into the bundle:

```typescript
// apps/*/env/index.ts
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
```

This means:
- `pnpm run build` → `NODE_ENV=production`, `DOCKER` unset → local production config
- `DOCKER=true pnpm run build` → Docker/GCP config with cloud URLs

### Configuration Per Environment

| Environment      | NODE_ENV     | DOCKER  | API URL                                     |
| ---------------- | ------------ | ------- | ------------------------------------------- |
| Local dev        | development  | -       | `http://localhost:3032`                     |
| Local production | production   | -       | `http://localhost:3002`                     |
| Docker/GCP       | production   | `true`  | `https://cohbrgr-api-....run.app`           |

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

## Health Checks

Each application exposes a health endpoint:

```bash
curl http://localhost:3030/health  # shell
curl http://localhost:3031/health  # content
curl http://localhost:3032/health  # api
```

Use these for container orchestration health checks and load balancer configuration.
