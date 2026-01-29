# Configuration

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | Set to `production` for production builds |
| `DOCKER` | When set, uses Cloud Run URLs |

## Ports

| Environment | Port |
|-------------|------|
| Production | 3000 |
| Development | 3030 |

## Public Paths

| Environment | URL |
|-------------|-----|
| Local production | `http://localhost:3000/` |
| Local development | `http://localhost:3030/` |
| Cloud Run | `https://cohbrgr.com/` |

## Server Middleware

The Express server applies middleware in this order:

1. **Rate limiting** (production only) - 500 requests per 10 minutes per IP
2. **nocache** - Disables browser caching headers
3. **logging** - Request logging
4. **methodDetermination** - Restricts to GET/HEAD
5. **compression** - Gzip response compression
6. **static** - Serves client build assets
7. **CSP nonce** - Generates nonce for inline scripts
8. **health** - Health check at `/health`
9. **SSR render** - React server-side rendering

## Deployment

Build and run with Docker:

```bash
docker build -t cohbrgr-shell .
docker run -p 3000:3000 -e DOCKER=true cohbrgr-shell
```

The content remote must be running and accessible at the configured URL for the app to load the Content component.
