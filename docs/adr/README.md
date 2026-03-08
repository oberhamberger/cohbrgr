# Architectural Decision Records (ADRs)

This directory contains Architectural Decision Records (ADRs) for the cohbrgr project. ADRs document significant architectural decisions along with their context, consequences, and alternatives considered.

## What is an ADR?

An Architectural Decision Record captures an important architectural decision made along with its context and consequences. ADRs help:

- **New team members** understand why things are built a certain way
- **Future maintainers** avoid revisiting decisions without context
- **Current team** think through decisions systematically

## ADR Index

| ADR                                                 | Title                             | Status   | Date       |
| --------------------------------------------------- | --------------------------------- | -------- | ---------- |
| [0001](./0001-use-monorepo-structure.md)            | Use Monorepo Structure            | Accepted | 2025-01-28 |
| [0002](./0002-adopt-micro-frontend-architecture.md) | Adopt Micro-Frontend Architecture | Accepted | 2025-01-28 |
| [0003](./0003-use-module-federation.md)             | Use Module Federation             | Accepted | 2025-01-28 |
| [0004](./0004-choose-rspack-over-webpack.md)        | Choose Rspack Over Webpack        | Accepted | 2025-01-28 |
| [0005](./0005-implement-server-side-rendering.md)   | Implement Server-Side Rendering   | Accepted | 2025-01-28 |
| [0006](./0006-use-pnpm-workspaces-with-nx.md)       | Use pnpm Workspaces with Nx       | Accepted | 2025-01-28 |

## Creating a New ADR

1. Copy [TEMPLATE.md](./TEMPLATE.md) to `NNNN-short-description.md`
2. Fill in all sections
3. Update this README's index table
4. Submit for review

## Naming Convention

ADRs follow the pattern: `NNNN-short-description.md`

- `NNNN` - Zero-padded sequential number (0001, 0002, etc.)
- `short-description` - Lowercase, hyphen-separated summary

## Status Definitions

- **Proposed** - Under discussion, not yet decided
- **Accepted** - Decision has been made and is in effect
- **Deprecated** - No longer relevant but kept for historical context
- **Superseded** - Replaced by a newer ADR (link to replacement)
