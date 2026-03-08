# Configuration

## Environment Variables

| Variable   | Purpose                                      |
| ---------- | -------------------------------------------- |
| `NODE_ENV` | Set to `production` for production builds    |
| `DOCKER`   | When set, uses Cloud Run URLs for publicPath |

## Ports

| Environment | Port |
| ----------- | ---- |
| Production  | 3001 |
| Development | 3031 |

## Public Paths

The client build's `publicPath` determines where the browser fetches chunks from:

| Environment       | Public Path                                               |
| ----------------- | --------------------------------------------------------- |
| Local production  | `http://localhost:3001/client/`                           |
| Local development | `http://localhost:3031/client/`                           |
| Cloud Run         | `https://cohbrgr-content-o44imzpega-oa.a.run.app/client/` |

## Deployment

Build and run with Docker:

```bash
docker build -t cohbrgr-content .
docker run -p 3001:3001 -e DOCKER=true cohbrgr-content
```

The shell app must be configured to fetch the remote entry from the correct URL matching the content app's deployment location.
