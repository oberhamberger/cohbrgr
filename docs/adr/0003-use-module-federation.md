# 0003 - Use Module Federation

**Status:** Accepted
**Date:** 2025-01-28

## Context

With the decision to use micro-frontend architecture (ADR-0002), we needed a mechanism to compose multiple applications at runtime. Options included:

- Build-time integration (npm packages)
- Server-side composition
- Client-side runtime composition

We needed a solution that:

- Allows independent deployment
- Shares dependencies efficiently
- Works with our SSR requirements
- Has good developer experience

## Decision

We will use Webpack Module Federation (via Rspack) for runtime micro-frontend composition.

Configuration:

- Shell app is configured as the **host** (consumes remote modules)
- Content app is configured as a **remote** (exposes modules)
- Shared dependencies (React, etc.) are configured to avoid duplication

Example remote configuration:

```javascript
new ModuleFederationPlugin({
    name: 'content',
    filename: 'remoteEntry.js',
    exposes: {
        './Content': './src/components/Content',
    },
    shared: ['react', 'react-dom'],
});
```

## Consequences

### Positive

- True runtime integration—no rebuild of shell needed for content changes
- Shared dependencies loaded once, reducing bundle size
- TypeScript support via `@module-federation/typescript`
- Works with SSR (with additional configuration)
- Active community and Webpack ecosystem compatibility

### Negative

- Runtime failures possible if remote is unavailable
- Version mismatches in shared deps can cause issues
- Debugging across federation boundaries is harder
- SSR configuration is complex
- Lock-in to Webpack/Rspack ecosystem

## Alternatives Considered

### NPM Package Integration

Publish micro-frontends as npm packages, consume at build time.

Not chosen because:

- Requires shell rebuild for any micro-frontend change
- Version coordination overhead
- Not true independent deployment

### Single-SPA

Framework for micro-frontend orchestration.

Not chosen because:

- Additional framework to learn and maintain
- More opinionated about routing
- Module Federation provides sufficient capability with less abstraction

### Web Components

Expose micro-frontends as custom elements.

Not chosen because:

- React integration with Web Components has friction
- Shadow DOM complicates shared styling
- Less mature tooling for our use case
