# Unit Testing (Jest)

This document outlines the implementation of unit testing using Jest in this monorepo.

## Base Configuration

The base Jest configuration is defined in the `@cohbrgr/jest` package. This package provides a shared configuration for all projects in the monorepo, ensuring consistency and reducing boilerplate.

The base configuration includes:

- **TypeScript Support**: Uses `ts-jest` to transpile TypeScript files.
- **Asset Stubbing**: Uses `jest-transform-stub` to handle non-JavaScript assets like CSS, images, and fonts.
- **Module Aliases**: Configures module aliases to allow for absolute imports from the `src` directory.

## Project-Specific Configurations

Each project that uses Jest has its own `jest.config.ts` file, which extends the base configuration from `@cohbrgr/jest`. This allows each project to set its own project-specific options, such as:

- `displayName`: A unique name for the project's test suite.
- `testEnvironment`: The test environment to use (`jsdom` for browser environments, `node` for Node.js environments).
- `rootDir`: The root directory for the project's tests.
- `testMatch`: A list of glob patterns that specify which files to include in the test run.

## Project Structures

Some projects, like `apps/content` and `apps/shell`, have a multi-project Jest setup. In these projects, there is a root-level `jest.config.ts` file that points to the Jest configurations for the different sub-projects (e.g., `client` and `server`).

## Running Tests

To run all the unit tests in the monorepo, use the following command:

```bash
pnpm run test
```
