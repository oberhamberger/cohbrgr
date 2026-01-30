# Packages

Shared packages live in `/packages` and are consumed by applications. Each package is published to the workspace under the `@cohbrgr` scope.

## Core Packages

### @cohbrgr/build

Rspack configuration utilities for building applications. Provides base configurations for client, server, and federated builds.

```typescript
import { createBaseConfig } from '@cohbrgr/build';
```

**Used by**: shell, content

### @cohbrgr/components

Shared React UI components used across applications.

| Component    | Description          |
| ------------ | -------------------- |
| `Navigation` | Site navigation menu |
| `Spinner`    | Loading indicator    |

```typescript
import { Navigation, Spinner } from '@cohbrgr/components';
```

**Used by**: shell, content

### @cohbrgr/server

Express.js middleware and server utilities.

| Export                  | Description                 |
| ----------------------- | --------------------------- |
| `loggingMiddleware`     | Request/response logging    |
| `errorMiddleware`       | Error handling              |
| `healthRouter`          | Health check endpoints      |
| `gracefulStartAndClose` | Server lifecycle management |

```typescript
import { healthRouter, loggingMiddleware } from '@cohbrgr/server';
```

**Used by**: shell, content, api

### @cohbrgr/utils

General-purpose utilities.

| Export            | Description          |
| ----------------- | -------------------- |
| `logger`          | Structured logging   |
| `findProcessArgs` | CLI argument parsing |
| `constants`       | Shared constants     |

```typescript
import { findProcessArgs, logger } from '@cohbrgr/utils';
```

**Used by**: All apps and packages

### @cohbrgr/figma

Design tokens extracted from Figma using Style Dictionary. Outputs SCSS variables and CSS custom properties.

**Output**: `packages/figma/src/tokens.json` transforms to SCSS/CSS

**Used by**: components, shell, content

### @cohbrgr/localization

Internationalization (i18n) utilities for React applications.

| Export                | Description                              |
| --------------------- | ---------------------------------------- |
| `TranslationProvider` | Context provider for translations        |
| `useTranslation`      | Hook to access translation context       |
| `Message`             | Component to render translated text      |
| `defaultTranslations` | Fallback English translations            |

```typescript
import { Message, TranslationProvider, useTranslation } from '@cohbrgr/localization';
```

**Used by**: shell, content

See [Localization](./08-localization.md) for detailed integration documentation.

## Configuration Packages

These packages provide shared configurations to ensure consistency across the monorepo.

### @cohbrgr/tsconfig

Base TypeScript configuration extended by all packages.

```json
{
    "extends": "@cohbrgr/tsconfig"
}
```

### @cohbrgr/eslint

Shared ESLint configuration for TypeScript and React.

```javascript
import baseConfig from '@cohbrgr/eslint';

export default [...baseConfig];
```

### @cohbrgr/prettier

Shared Prettier configuration.

```javascript
import config from '@cohbrgr/prettier';

export default config;
```

### @cohbrgr/jest

Base Jest configuration for TypeScript projects.

```typescript
import baseConfig from '@cohbrgr/jest';

export default { ...baseConfig };
```

## Dependency Graph

View the package dependency graph:

```bash
pnpm run graph
```

This opens an interactive visualization showing how packages depend on each other.
