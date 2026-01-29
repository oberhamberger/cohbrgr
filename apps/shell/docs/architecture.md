# Architecture

## Overview

The shell app is the Module Federation host that orchestrates micro-frontends. It provides SSR with hydration, routing, and the application layout.

```
src/
├── client/              # React application
│   ├── components/      # UI components (layout, etc.)
│   ├── pages/           # Route pages (offline, not-found)
│   ├── contexts/        # React contexts
│   ├── service-worker/  # PWA service worker
│   ├── App.tsx          # Root component with routing
│   └── routes.ts        # Route definitions
└── server/              # Express server with SSR
    ├── server.ts        # App configuration and middleware
    ├── middleware/      # SSR render middleware
    └── template/        # HTML template components
build/
└── configs/             # Rspack configurations
```

## Module Federation

This app acts as the **host** that consumes remotes. It doesn't expose any modules.

### Consumed Remotes

| Remote | Module | Usage |
|--------|--------|-------|
| `content` | `./Content` | Main page content |

The remote URL is determined by environment:
- Local: `http://localhost:3001/client/remoteEntry.js` (prod) or port 3031 (dev)
- Docker: Cloud Run URL from content app's config

### How Content is Loaded

```typescript
const Content = lazy(() => import('content/Content'));

<Suspense fallback={<Spinner />}>
    <Content />
</Suspense>
```

The Content component is lazy-loaded with a Suspense boundary showing a spinner during fetch.

## Server-Side Rendering

The shell renders React on the server for initial page loads:

1. Express receives request
2. `server-entry.ts` dynamically imports the render middleware
3. `render.tsx` uses `renderToPipeableStream` to stream HTML
4. Client receives fully-rendered HTML with hydration scripts
5. React hydrates and takes over on the client

SSR works with Module Federation—the server fetches the content remote's server build.

## Dual Build

Rspack produces two builds:

1. **Client build** (`dist/client/`) - Browser bundles, service worker, static assets
2. **Server build** (`dist/server/`) - Node.js server with SSR capability

Both include Module Federation configuration to support SSR with the content remote.

## Client Features

- **Routing** - React Router with routes for home, offline, and 404 pages
- **Service Worker** - Workbox-powered PWA with precaching
- **Web Vitals** - CLS, INP, LCP metrics logged to console
- **Lazy Loading** - Remote components loaded on demand
