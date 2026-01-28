# 0005 - Implement Server-Side Rendering

**Status:** Accepted
**Date:** 2025-01-28

## Context

The application needs to deliver content that is:

- Accessible to search engines for SEO
- Fast to first meaningful paint
- Functional before JavaScript loads (progressive enhancement)

Client-side rendering (CSR) alone doesn't meet these requirements as content isn't available until JavaScript executes.

## Decision

We will implement server-side rendering (SSR) with client-side hydration using Express and React.

Architecture:

1. Express server receives request
2. React components render to HTML string on server
3. HTML sent to client with initial state
4. Client-side React hydrates the DOM
5. Subsequent navigation handled client-side (SPA behavior)

The `@cohbrgr/server` package provides Express middleware and utilities for SSR.

```javascript
// Simplified SSR flow
app.get('*', (req, res) => {
    const html = renderToString(<App />);
    res.send(template(html, initialState));
});
```

## Consequences

### Positive

- Content visible immediately (better perceived performance)
- Search engines can index content
- Works without JavaScript (graceful degradation)
- Reduced time to first contentful paint
- Social media previews work correctly

### Negative

- Server compute cost for rendering
- Increased complexity (hydration mismatches, server/client differences)
- Module Federation + SSR requires careful configuration
- Memory management on server needs attention
- Some client-only libraries need special handling

## Alternatives Considered

### Client-Side Rendering Only

Serve minimal HTML, render everything in browser.

Not chosen because:

- Poor SEO without additional tooling
- Slow first paint on slower devices/connections
- Content not accessible without JavaScript

### Static Site Generation (SSG)

Pre-render all pages at build time.

Not chosen because:

- Dynamic content would still need client rendering
- Build times increase with page count
- Not suitable for personalized content
- Project goal is to demonstrate SSR patterns

### Next.js

React framework with built-in SSR.

Not chosen because:

- Project goal is to understand SSR without framework magic
- Next.js has opinions that conflict with Module Federation approach
- Learning opportunity in building SSR from primitives
