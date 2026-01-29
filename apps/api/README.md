# API Application

REST API server providing navigation and i18n data for frontend applications.

## Quick Start

```bash
# Development
pnpm run dev:api

# Production build
pnpm run build:api

# Serve production
pnpm run serve:api
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/navigation` | Full navigation tree |
| GET | `/navigation/:nodeId` | Navigation subtree |
| GET | `/translation` | All translations |
| GET | `/translation/:lang` | Language-specific translations |

## Documentation

- [API Reference](docs/api-reference.md) - Endpoint details and examples
- [Architecture](docs/architecture.md) - Module structure and patterns
- [Configuration](docs/configuration.md) - Environment and deployment

## Testing

```bash
pnpm test
```
