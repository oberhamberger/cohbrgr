# Packages

This project contains a number of shared packages that are used by the applications. These packages are located in the `/packages` directory.

## `@cohbrgr/build`

This package provides the core build configuration for the monorepo, using Rspack as the bundler. It is designed to handle TypeScript, React, and Module Federation.

## `@cohbrgr/components`

This package contains shared UI components used across the applications, such as `Navigation` and `Spinner`.

## `@cohbrgr/eslint`

This package provides the base ESLint configuration for all TypeScript and React projects within the monorepo.

## `@cohbrgr/figma`

This package is responsible for managing and transforming design tokens from Figma into SCSS and CSS variables using Style Dictionary.

## `@cohbrgr/jest`

This package provides a shared base Jest configuration for TypeScript projects within the monorepo.

## `@cohbrgr/prettier`

This package provides the shared Prettier configuration for all projects within the monorepo.

## `@cohbrgr/server`

This package provides a collection of reusable server-side middleware functions for Express.js applications.

## `@cohbrgr/tsconfig`

This package provides the base TypeScript configuration (`tsconfig.json`) for all TypeScript projects within the monorepo.

## `@cohbrgr/utils`

This package provides a collection of general-purpose utility functions and modules, such as a logger and a process argument parser.
