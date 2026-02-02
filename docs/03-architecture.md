# Architecture

This document explains how the cohbrgr system is structured and how its components interact.

## Overview

cohbrgr uses a micro-frontend architecture where a host application (shell) orchestrates multiple remote applications at runtime. This enables independent development and deployment while sharing common dependencies.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Shell App                      │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐   │   │
│  │  │  Navigation │  │   Content (federated)   │   │   │
│  │  └─────────────┘  └─────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Shell Server  │    │  Content Server │    │    API Server   │
│   (SSR + Host)  │◄───│    (Remote)     │    │    (Express)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Application Ports

Ports are determined at **build time** based on `NODE_ENV`. This ensures development and production builds can run on different ports without runtime configuration.

| Application | Development | Production |
| ----------- | ----------- | ---------- |
| Shell       | 3030        | 3000       |
| Content     | 3031        | 3001       |
| API         | 3032        | 3002       |

**Note**: The port is baked into the bundle during build:
- `pnpm run dev` builds with `NODE_ENV=development` → uses 303x ports
- `pnpm run build` builds with `NODE_ENV=production` → uses 300x ports

## Monorepo Structure

The codebase is organized into apps (deployable) and packages (shared libraries):

```
cohbrgr/
├── apps/
│   ├── shell/          # Host application
│   ├── content/        # Remote micro-frontend
│   └── api/            # API server
└── packages/
    ├── build/          # Rspack configuration
    ├── components/     # Shared React components
    ├── server/         # Express middleware
    ├── utils/          # General utilities
    ├── figma/          # Design tokens
    └── [configs]/      # ESLint, Prettier, Jest, TSConfig
```

See [ADR-0001](./adr/0001-use-monorepo-structure.md) for the rationale behind the monorepo approach.

## Micro-Frontend Architecture

### Host and Remotes

- **Shell (Host)**: The main application that renders the page layout and loads remote components
- **Content (Remote)**: Exposes components that shell consumes at runtime

This separation allows:

- Independent deployment of features
- Isolated failure domains
- Team autonomy over their micro-frontend

See [ADR-0002](./adr/0002-adopt-micro-frontend-architecture.md) for more details.

### Module Federation

Module Federation enables runtime code sharing between separately built applications. The shell app declares which remotes it consumes, and remotes declare which modules they expose.

```javascript
// content exposes
exposes: {
  './Content': './src/components/Content'
}

// shell consumes
remotes: {
  content: 'content@http://localhost:3031/remoteEntry.js'
}
```

Shared dependencies (React, React DOM) are loaded once and shared across all federated modules.

See [ADR-0003](./adr/0003-use-module-federation.md) for the decision rationale.

## Server-Side Rendering

The shell application renders React to HTML on the server before sending it to the client. This improves:

- **Performance**: Users see content faster
- **SEO**: Search engines can index the content
- **Accessibility**: Works without JavaScript

### Request Flow

1. Browser requests a page from shell server
2. Shell server renders React components to HTML
3. HTML is sent to browser with initial state
4. Browser displays HTML immediately
5. React hydrates the page, making it interactive
6. Subsequent navigation happens client-side (SPA behavior)

See [ADR-0005](./adr/0005-implement-server-side-rendering.md) for implementation details.

## Build System

Rspack handles bundling with Webpack-compatible configuration. Nx orchestrates builds across the monorepo with intelligent caching.

### Build Order

Packages are built in dependency order:

1. Config packages (tsconfig, eslint, prettier, jest)
2. Utilities (utils, build)
3. Libraries (components, server)
4. Applications (shell, content, api)

### Caching

Nx caches build outputs. If source files haven't changed, cached outputs are restored instead of rebuilding.

See [ADR-0004](./adr/0004-choose-rspack-over-webpack.md) and [ADR-0006](./adr/0006-use-pnpm-workspaces-with-nx.md) for tooling decisions.

## Data Flow

1. **API Server** provides REST endpoints for navigation and translations
2. **Shell Server** creates a QueryClient for SSR, renders React with Suspense
3. **Content (federated)** uses `useSuspenseQuery` to fetch translations during SSR
4. **Shell Server** dehydrates QueryClient after render, embeds in HTML as `__initial_state__`
5. **Shell Client** hydrates with `HydrationBoundary`, restoring the query cache
6. **Content** on client uses cached data - no refetch needed on initial load

### TanStack Query Integration

TanStack Query is shared as a singleton across shell and content via Module Federation. This enables:

- Federated components to use `useSuspenseQuery` during SSR
- Automatic cache sharing between host and remotes
- SSR hydration via `dehydrate()` and `HydrationBoundary`
