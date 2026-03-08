# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**cohbrgr** (C·V·Q·O - Codex Visioque) is a TypeScript monorepo demonstrating SSR React with micro-frontend architecture. It's an experimental project exploring Module Federation, static site generation, and modern bundling without relying on create-react-app or Next.js.

## Commands

```bash
# Install dependencies
pnpm install

# Full clean rebuild
pnpm run bootstrap

# Build all packages and apps
pnpm run build

# Development mode (all apps)
pnpm run dev

# Run specific app in dev mode
pnpm run dev:shell
pnpm run dev:content
pnpm run dev:api

# Production serve
pnpm run serve

# Run tests
pnpm run test
pnpm run test:components    # Test specific package
pnpm run test:integration   # Full integration test (builds, starts all apps, runs smoke tests)

# Run tests with coverage (within a package/app directory)
npx jest --coverage

# Linting and formatting
pnpm run lint
pnpm run prettier

# Build specific packages (respects dependency order)
pnpm run build:compiler     # Build @cohbrgr/build first (required by others)
pnpm run build:shell
pnpm run build:content
pnpm run build:api

# View dependency graph
pnpm run graph
```

## Architecture

### Micro-Frontend Structure

Three deployable applications communicate via Module Federation:

- **shell** (`apps/shell/`) - Host application, SSR container, orchestrates micro-frontends
- **content** (`apps/content/`) - Remote micro-frontend exposing `Content` component
- **api** (`apps/api/`) - Express API server

### Shared Packages (`packages/`)

| Package                                                                      | Purpose                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `@cohbrgr/build`                                                             | Rspack/Webpack configuration utilities                          |
| `@cohbrgr/components`                                                        | Shared React UI components                                      |
| `@cohbrgr/env`                                                               | Shared environment constants (ports, origins)                   |
| `@cohbrgr/server`                                                            | Express.js middleware (logging, correlation IDs, rate limiting) |
| `@cohbrgr/figma`                                                             | Design tokens from Figma via Style Dictionary                   |
| `@cohbrgr/utils`                                                             | General utilities (logger, argument parser)                     |
| `@cohbrgr/localization`                                                      | i18n utilities (TranslationProvider, useTranslation, Message)   |
| `@cohbrgr/eslint`, `@cohbrgr/prettier`, `@cohbrgr/jest`, `@cohbrgr/tsconfig` | Shared configs                                                  |

### Key Technical Decisions

- **Rspack** for bundling (Webpack-compatible, faster builds)
- **Module Federation** enables runtime micro-frontend composition
- **SSR with hydration** - Express renders React server-side, client takes over
- **Nx** manages monorepo build orchestration and caching
- **pnpm workspaces** for package management

### Application Ports

Ports are determined at **build time** based on `NODE_ENV`:

| Application | Development (`pnpm run dev`) | Production (`pnpm run serve`) |
| ----------- | ---------------------------- | ----------------------------- |
| Shell       | 3030                         | 3000                          |
| Content     | 3031                         | 3001                          |
| API         | 3032                         | 3002                          |

After any changes to port configuration, run the verification script:

```bash
./scripts/verify-ports.sh
```

### Data Flow

1. Shell app server-side renders React using Express
2. Module Federation fetches Content component from content app at runtime
3. HTML sent to client with initial state
4. Client-side React hydrates and handles subsequent navigation

## Docker

Each app has its own Dockerfile. Use docker-compose for multi-app local setup:

```bash
docker-compose up
```

## Versioning

The project uses **CalVer** (Calendar Versioning) with the format `YYYY.MM.PATCH`. All packages share a single version. Use the version script to bump:

```bash
./scripts/version.sh          # bump patch (e.g. 2026.03.0 → 2026.03.1)
./scripts/version.sh minor    # new month (e.g. 2026.03.1 → 2026.04.0)
./scripts/version.sh 2026.05.0  # set explicit version
```

## Deployment

Deploy to Google Cloud Run via Cloud Build. Requires `gcloud` CLI authenticated with project `cohb-9fa5f`.

```bash
pnpm run ship          # build + deploy to production (asks for confirmation)
pnpm run ship:dry      # build only, no deploy
```

Deployment builds all three apps in parallel, pushes images to Artifact Registry, deploys to Cloud Run, and runs e2e smoke tests against production. The `--dry-run` flag skips deploy and e2e steps.

## CI Commands

The following commands are executed in GitHub Actions and should pass locally before committing:

```bash
pnpm install          # Install dependencies
pnpm run build        # Build all packages and apps
pnpm run lint         # Run ESLint (warnings OK, errors fail)
pnpm run test         # Run all tests
lhci autorun          # Lighthouse CI (requires Chrome/Chromium)
```

## Claude Code Settings

Shared Claude Code permissions are stored in `.claude/settings.json`. Local/personal settings go in `.claude/settings.local.json` (gitignored).

The shared settings pre-approve common commands like `pnpm run test`, `git status`, `git commit`, etc.

## Git Guidelines

- **Never run `git push`** - Pushing to `develop` triggers GitHub Actions, and pushing to `main` triggers deployment. The user will handle pushing manually.
