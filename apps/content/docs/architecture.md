# Architecture

## Overview

The content app is a Module Federation remote that exposes React components for consumption by the shell (host) app. It has both client and server builds.

```
src/
├── client/              # React components and client entry
│   ├── components/      # Exposed components
│   └── index.ts         # Client entry point
└── server/              # Express server
    ├── server.ts        # App configuration
    └── index.ts         # Entry point
build/
└── configs/             # Rspack configurations
    ├── rspack.client.config.ts
    ├── rspack.server.config.ts
    └── rspack.federated.config.ts
```

## Module Federation

This app acts as a **remote** in the Module Federation architecture. The shell app is the **host** that consumes components from this remote.

### Exposed Modules

| Name | Path | Description |
|------|------|-------------|
| `./Content` | `src/client/components/content` | Main page content component |

### Shared Dependencies

React and ReactDOM are shared as singletons to ensure a single instance across host and remote:

- `react` - singleton, version from root package.json
- `react-dom` - singleton, version from root package.json

### How the Shell Consumes Content

The shell app loads the `Content` component dynamically:

```typescript
const Content = React.lazy(() => import('content/Content'));
```

The shell renders it within a Suspense boundary, showing a loading state while the remote is fetched.

## Dual Build

The rspack config produces two builds:

1. **Client build** (`dist/client/`) - Browser bundles including `remoteEntry.js`
2. **Server build** (`dist/server/`) - Node.js server that serves the client files

Both builds include Module Federation configuration to support SSR with hydration.

## Server Role

The Express server's only job is to serve static files from the client build. It doesn't render React—that's handled by the shell's SSR. The server provides:

- Static file serving from `/client/`
- Health check at `/health`
- Request logging
