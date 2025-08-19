# @cohbrgr/build

This package provides the build configuration and tools for the cohbrgr monorepo. It uses Rspack for fast and efficient bundling of the application.

## Features

- **Rspack Configuration:** Includes a base Rspack configuration that can be extended for different environments (development, production).
- **SWC Transpilation:** Uses the SWC compiler for fast TypeScript and JavaScript transpilation.
- **SASS/SCSS Support:** Provides support for SASS/SCSS with CSS Modules.
- **Static Site Generation (SSG):** Includes a simple static site generator for pre-rendering pages.
- **Utility Functions and Constants:** Provides a set of utility functions and constants to be used across the monorepo.

## Usage

This package is intended to be used as a dependency in other packages within the monorepo. The exported configurations and utilities can be imported and used to build other parts of the application.

### Example

```typescript
import { merge } from 'webpack-merge';

import { baseConfig } from '@cohbrgr/build';

const myConfig = merge(baseConfig, {
    // my custom config
});
```

## Configuration

The build process can be configured using the following environment variables and command-line arguments:

- `NODE_ENV`: Set to `production` for production builds.
- `--watch`: Enables watch mode.
- `--analyze`: Enables bundle analysis.
- `--generator`: Enables Static Site Generation (SSG).

## Scripts

- `npm run lint`: Lints the package files.
- `npm run build`: Builds the package.
