# 0006 - Use pnpm Workspaces with Nx

**Status:** Accepted
**Date:** 2025-01-28

## Context

With a monorepo structure (ADR-0001), we need tooling for:

- **Package management** - Installing dependencies, linking local packages
- **Build orchestration** - Building packages in correct dependency order
- **Caching** - Avoiding redundant work on unchanged packages
- **Task running** - Executing scripts across multiple packages

These concerns can be addressed by different tools, and we needed to decide on the combination.

## Decision

We will use pnpm for package management combined with Nx for build orchestration.

**pnpm workspaces** handles:

- Dependency installation with strict hoisting
- Workspace protocol for local package linking (`workspace:*`)
- Disk-efficient storage via content-addressable store

**Nx** handles:

- Task orchestration respecting dependency graph
- Local and remote caching of build outputs
- Parallel execution of independent tasks
- Affected detection (only rebuild what changed)

Configuration:

- `pnpm-workspace.yaml` defines workspace packages
- `nx.json` configures caching and task pipelines
- Each package's `package.json` defines its scripts

## Consequences

### Positive

- pnpm's strict mode prevents phantom dependencies
- Disk space savings from pnpm's content-addressable storage
- Nx caching dramatically speeds up CI and local rebuilds
- Clear separation: pnpm for packages, Nx for tasks
- `nx graph` visualizes project dependencies
- Affected commands enable efficient CI

### Negative

- Two tools to understand instead of one
- Nx configuration has learning curve
- Cache invalidation can be tricky to debug
- Some developers unfamiliar with pnpm

## Alternatives Considered

### npm/Yarn Workspaces + Lerna

Traditional monorepo tooling combination.

Not chosen because:

- Lerna is less actively maintained
- npm/Yarn hoisting is less strict than pnpm
- No built-in caching (would need separate tool)

### Yarn Berry (PnP) + Turborepo

Modern alternative combination.

Not chosen because:

- Plug'n'Play has compatibility issues with some tools
- Turborepo caching is comparable to Nx but less mature
- Team had more experience with pnpm

### Nx Integrated Monorepo

Use Nx for everything including package management.

Not chosen because:

- More opinionated structure required
- pnpm workspace protocol is simpler for our needs
- Wanted flexibility to use standard package.json scripts

### Bazel

Google's build system for large-scale monorepos.

Not chosen because:

- Significant learning curve
- Overkill for project size
- Less JavaScript ecosystem integration
