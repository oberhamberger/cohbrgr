# Configuration

## Environment Variables

| Variable   | Purpose                                            |
| ---------- | -------------------------------------------------- |
| `NODE_ENV` | Set to `production` for production builds          |
| `DOCKER`   | When set, uses Cloud Run URLs instead of localhost |

## Port

The API runs on port `3002` in all environments.

## Deployment

The app includes a Dockerfile for containerized deployment. When running in Docker or Cloud Run, set the `DOCKER` environment variable to configure the correct public URLs.

```bash
docker build -t cohbrgr-api .
docker run -p 3002:3002 -e DOCKER=true cohbrgr-api
```
