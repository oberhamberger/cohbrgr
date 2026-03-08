# Introduction

cohbrgr is a TypeScript monorepo that explores modern web architecture patterns without relying on opinionated frameworks like Next.js or create-react-app. It serves as both a functional website and an educational reference for building SSR React applications with micro-frontend architecture.

## Why This Project Exists

Most modern React projects reach for Next.js or similar meta-frameworks. While these tools are excellent, they abstract away the underlying mechanics. This project takes a different approach: building SSR, micro-frontends, and module federation from first principles to understand how these technologies actually work.

## Core Technologies

| Technology            | Purpose                                     |
| --------------------- | ------------------------------------------- |
| **TypeScript**        | Type safety across the entire codebase      |
| **React 19**          | UI components and rendering                 |
| **Rspack**            | Fast, Webpack-compatible bundling           |
| **Module Federation** | Runtime micro-frontend composition          |
| **Express**           | Server-side rendering and API               |
| **pnpm + Nx**         | Monorepo management and build orchestration |

## Project Structure

```
cohbrgr/
├── apps/                    # Deployable applications
│   ├── shell/               # Host app, SSR container
│   ├── content/             # Remote micro-frontend
│   └── api/                 # REST API server
├── packages/                # Shared libraries
│   ├── build/               # Rspack configuration
│   ├── components/          # Shared UI components
│   ├── server/              # Express middleware
│   └── ...                  # Config packages
└── docs/                    # Documentation
    └── adr/                 # Architectural Decision Records
```

## Design Principles

1. **Learn by building** - Understand the mechanics, not just the abstractions
2. **Keep it simple** - Minimal dependencies, clear data flow
3. **Document decisions** - ADRs capture the "why" behind architectural choices
4. **Share code wisely** - Packages extract genuinely reusable logic

## Next Steps

- [Getting Started](./02-getting-started.md) - Set up your development environment
- [Architecture](./03-architecture.md) - Understand how the pieces fit together
- [ADRs](./adr/README.md) - Learn why specific technologies were chosen
