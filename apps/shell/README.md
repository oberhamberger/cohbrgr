# Shell Application

Module Federation host that provides SSR, routing, and orchestrates micro-frontends.

## Quick Start

```bash
# Development
pnpm run dev:shell

# Production build
pnpm run build:shell

# Serve production
pnpm run serve:shell
```

## Consumed Remotes

| Remote    | Module      | Description       |
| --------- | ----------- | ----------------- |
| `content` | `./Content` | Main page content |

Loaded via React.lazy with Suspense fallback.

## Routes

| Path       | Page                  |
| ---------- | --------------------- |
| `/`        | Content (from remote) |
| `/offline` | Offline page          |
| `*`        | Not found             |

## Endpoints

| Method | Path      | Description        |
| ------ | --------- | ------------------ |
| GET    | `/health` | Health check       |
| GET    | `/*`      | SSR rendered pages |

## Documentation

- [Architecture](docs/architecture.md) - SSR, Module Federation host, client/server structure
- [Configuration](docs/configuration.md) - Environment, middleware stack, deployment

## Testing

```bash
pnpm test
```
