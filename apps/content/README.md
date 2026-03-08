# Content Application

Module Federation remote that exposes the main page content component for consumption by the shell app.

## Quick Start

```bash
# Development
pnpm run dev:content

# Production build
pnpm run build:content

# Serve production
pnpm run serve:content
```

## Exposed Components

| Module      | Description                       |
| ----------- | --------------------------------- |
| `./Content` | Main page content with navigation |

Consumed by the shell app via:

```typescript
const Content = React.lazy(() => import('content/Content'));
```

## Endpoints

| Method | Path        | Description                            |
| ------ | ----------- | -------------------------------------- |
| GET    | `/health`   | Health check                           |
| GET    | `/client/*` | Static files (JS, CSS, remoteEntry.js) |

## Documentation

- [Architecture](docs/architecture.md) - Module Federation setup and dual build
- [Configuration](docs/configuration.md) - Environment and deployment

## Testing

```bash
pnpm test
```
