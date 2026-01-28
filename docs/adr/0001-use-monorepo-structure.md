# 0001 - Use Monorepo Structure

**Status:** Accepted
**Date:** 2025-01-28

## Context

The cohbrgr project consists of multiple applications (shell, content, api) and shared packages (components, utils, build tools, configs). We needed to decide how to organize these codebases: as separate repositories (polyrepo) or a single repository (monorepo).

Key considerations:

- Multiple apps share significant code (components, utilities, configurations)
- Changes often span multiple packages simultaneously
- Team needs consistent tooling and standards across all code
- Deployment pipelines need to understand inter-package dependencies

## Decision

We will use a monorepo structure with all applications and packages in a single repository.

The structure follows:

```
cohbrgr/
├── apps/           # Deployable applications
│   ├── shell/
│   ├── content/
│   └── api/
├── packages/       # Shared libraries and configs
│   ├── components/
│   ├── utils/
│   ├── build/
│   └── ...
└── docs/
```

## Consequences

### Positive

- Atomic commits across multiple packages ensure consistency
- Shared tooling configuration (ESLint, Prettier, TypeScript) is defined once
- Refactoring across package boundaries is straightforward
- Single CI/CD pipeline with intelligent caching
- Easier onboarding—one clone gets everything

### Negative

- Repository size grows over time
- Requires tooling to manage builds and dependencies (addressed by Nx)
- All developers have access to all code (may not suit all organizations)
- Git history is shared across unrelated packages

## Alternatives Considered

### Polyrepo (Separate Repositories)

Each app and package in its own repository with npm/git dependencies.

Not chosen because:

- Cross-package changes require multiple PRs and releases
- Version synchronization becomes complex
- Shared config drift is harder to prevent
- Higher cognitive overhead managing multiple repos

### Git Submodules

Single repo with packages as submodules.

Not chosen because:

- Submodules add complexity to git workflows
- Developers must remember to update submodules
- CI/CD becomes more complex
- Doesn't solve the atomic commit problem
