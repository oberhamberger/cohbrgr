# `@cohbrgr/tsconfig`

This package provides the base TypeScript configuration (`tsconfig.json`) for all TypeScript projects within the Cohbrgr monorepo.

## Overview

This `tsconfig.json` is designed to enforce strict type checking and provide a consistent development experience across all TypeScript-based projects. It extends well-established base configurations and includes common settings suitable for modern web development.

## Configuration Details

The `tsconfig.json` in this package extends the following base configurations:

-   **`@tsconfig/strictest/tsconfig`**: Provides a highly strict set of TypeScript compiler options, promoting robust and error-free code.
-   **`@tsconfig/node22/tsconfig`**: Configures TypeScript for Node.js environments, targeting Node.js version 22.

In addition to the extended configurations, the following `compilerOptions` are explicitly set or overridden:

-   **`jsx`**: `"react-jsx"` - Specifies the JSX factory to use, enabling the new JSX transform for React.
-   **`sourceMap`**: `true` - Generates source map files (`.map`) for easier debugging.
-   **`incremental`**: `true` - Enables incremental compilation, which speeds up subsequent compilations by caching information from previous compilations.
-   **`allowJs`**: `false` - Disallows JavaScript files to be included in the compilation.
-   **`checkJs`**: `false` - Disables type checking for JavaScript files.
-   **`resolveJsonModule`**: `true` - Allows importing `.json` files as modules.
-   **`typeRoots`**: `["../../node_modules/@types", "../../@types"]` - Specifies the directories where TypeScript should look for type definition files. This ensures that types from `node_modules` and any custom types in the monorepo are correctly resolved.

## Usage

To use this base TypeScript configuration in your project, extend it in your project's `tsconfig.json` file:

```json
{
  "extends": "@cohbrgr/tsconfig",
  "compilerOptions": {
    // Project-specific overrides or additional compiler options
    "outDir": "./dist"
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

By extending this base configuration, your project will inherit all the strictness and common settings defined here, while still allowing you to add project-specific configurations.
