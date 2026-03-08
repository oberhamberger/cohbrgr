# Configuration

## Environment Variables

| Variable    | Purpose                                            |
| ----------- | -------------------------------------------------- |
| `NODE_ENV`  | Set to `production` for production builds          |
| `CLOUD_RUN` | When set, uses Cloud Run URLs instead of localhost |

## Port

The API runs on port `3002` in all environments.

## Deployment

The app includes a Dockerfile for containerized deployment. When running on Cloud Run, the `CLOUD_RUN` environment variable configures the correct public URLs.

```bash
docker build -t cohbrgr-api .
docker run -p 3002:3002 -e CLOUD_RUN=true cohbrgr-api
```
