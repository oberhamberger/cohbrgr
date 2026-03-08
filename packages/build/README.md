# @cohbrgr/build

This package provides Rspack build configuration and utilities for the cohbrgr monorepo. It handles bundling for both client and server builds with support for TypeScript, React, SCSS, and Module Federation.

## Installation

```bash
pnpm add @cohbrgr/build
```

## Exports

| Export            | Type     | Description                    |
| ----------------- | -------- | ------------------------------ |
| `baseConfig`      | Object   | Base Rspack configuration      |
| `getStyleLoader`  | Function | SCSS/CSS loader chain          |
| `findProcessArgs` | Function | CLI argument detection         |
| Constants         | Various  | Build flags and regex patterns |

## Configuration

### `baseConfig`

Base Rspack configuration that can be extended for different build targets.

```typescript
import { merge } from 'webpack-merge';

import { baseConfig } from '@cohbrgr/build';

export default merge(baseConfig, {
    // Custom configuration
    entry: './src/index.ts',
    output: {
        path: './dist',
    },
});
```

## Loaders

### `getStyleLoader()`

Returns the loader chain for processing SCSS/SASS files with Lightning CSS.

**Includes:**

- `lightningcss-loader` - Fast CSS processing
- `sass-loader` - SCSS compilation with `sass-embedded`

```typescript
import { getStyleLoader } from '@cohbrgr/build';

const config = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: getStyleLoader(),
            },
        ],
    },
};
```

## Constants

### Environment Flags

| Constant        | Type    | Description                    |
| --------------- | ------- | ------------------------------ |
| `isProduction`  | boolean | `NODE_ENV === 'production'`    |
| `isDevelopment` | boolean | Not production                 |
| `isWatch`       | boolean | Watch mode enabled             |
| `isAnalyze`     | boolean | Bundle analysis enabled        |
| `isSSG`         | boolean | Static site generation enabled |
| `isShell`       | boolean | Building shell app             |
| `isCloudRun`    | boolean | Running on Google Cloud Run    |

```typescript
import { isDevelopment, isProduction, isWatch } from '@cohbrgr/build';

const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isDevelopment ? 'source-map' : false,
    watch: isWatch,
};
```

### Regex Patterns

Pre-defined patterns for matching file types in loader rules:

| Constant            | Pattern                         | Matches          |
| ------------------- | ------------------------------- | ---------------- |
| `regexStyle`        | `/\.(s?[ac]ss)$/`               | All style files  |
| `regexGlobalStyle`  | `/global\.(s?[ac]ss)$/`         | Global styles    |
| `regexModuleStyles` | `/\.module\.(s?[ac]ss)$/`       | CSS modules      |
| `regexTypescript`   | `/\.(ts\|tsx)$/`                | TypeScript files |
| `regexSource`       | `/\.(ts\|tsx\|js\|jsx)$/`       | All source files |
| `regexFonts`        | `/\.(woff(2)?\|ttf\|eot)$/`     | Font files       |
| `regexFiles`        | `/\.(png\|jp(e*)g\|ico\|svg)$/` | Image files      |

```typescript
import { regexModuleStyles, regexTypescript } from '@cohbrgr/build';

const config = {
    module: {
        rules: [
            {
                test: regexTypescript,
                loader: 'builtin:swc-loader',
            },
            {
                test: regexModuleStyles,
                type: 'css/module',
            },
        ],
    },
};
```

### Other Constants

| Constant        | Value     | Description                 |
| --------------- | --------- | --------------------------- |
| `Mode`          | Enum      | `DEVELOPMENT`, `PRODUCTION` |
| `serviceWorker` | `'sw.js'` | Service worker filename     |
| `CWD`           | string    | Current working directory   |
| `port`          | number    | Default port (3000/3030)    |

## Utilities

### `findProcessArgs(searchArgs: string | string[]): boolean`

Checks if CLI arguments are present in `process.argv`.

```typescript
import { findProcessArgs } from '@cohbrgr/build';

if (findProcessArgs('--analyze')) {
    // Enable bundle analyzer
}

if (findProcessArgs(['--watch', '-w'])) {
    // Enable watch mode
}
```

## CLI Arguments

The build configuration responds to these CLI flags:

| Flag            | Effect                        |
| --------------- | ----------------------------- |
| `--watch`, `-w` | Enable watch mode             |
| `--analyze`     | Enable bundle analysis        |
| `--generator`   | Enable static site generation |

```bash
# Watch mode
pnpm build --watch

# Analyze bundle
pnpm build --analyze

# Generate static site
pnpm build --generator
```

## Features

- **Rspack** - Fast Rust-based bundler, Webpack-compatible
- **SWC** - Fast TypeScript/JavaScript transpilation
- **SCSS/SASS** - Style preprocessing with CSS Modules support
- **Lightning CSS** - Fast CSS processing and minification
- **Static Site Generation** - Pre-render pages at build time
