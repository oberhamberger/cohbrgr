# 0004 - Choose Rspack Over Webpack

**Status:** Accepted
**Date:** 2025-01-28

## Context

The project requires a bundler that supports:

- Module Federation for micro-frontend architecture
- Server-side rendering
- TypeScript and modern JavaScript
- Development server with hot module replacement

Webpack is the established standard but has known performance issues with large projects. Newer alternatives have emerged that promise faster builds.

## Decision

We will use Rspack as our primary bundler.

Rspack is a Rust-based bundler that:

- Maintains high compatibility with Webpack's API and plugin ecosystem
- Provides significantly faster build times (5-10x in many cases)
- Supports Module Federation out of the box
- Works with existing Webpack loaders

Our build configuration (`@cohbrgr/build` package) wraps Rspack configuration utilities for consistent setup across apps.

## Consequences

### Positive

- Dramatically faster builds improve developer experience
- Existing Webpack knowledge transfers directly
- Module Federation works without modification
- Can fall back to Webpack if needed (API compatible)
- Active development and growing community

### Negative

- Younger project than Webpack—fewer edge cases documented
- Some Webpack plugins may not be compatible
- Team needs awareness of subtle differences
- Debugging may require understanding both Rspack and Webpack

## Alternatives Considered

### Webpack

The established standard for complex bundling needs.

Not chosen as primary because:

- Build times are significantly slower
- Still available as fallback if needed

### Vite

Modern dev server with Rollup-based production builds.

Not chosen because:

- Module Federation support is limited/experimental
- Different mental model (ESM-first) would require more changes
- SSR story is different from Webpack ecosystem

### Turbopack

Vercel's Rust-based Webpack successor.

Not chosen because:

- Tightly coupled to Next.js at time of decision
- Less mature Module Federation support
- Limited standalone usage documentation

### esbuild

Extremely fast JavaScript bundler.

Not chosen because:

- No Module Federation support
- Limited plugin ecosystem for our needs
- Better suited as a transpiler than full bundler
