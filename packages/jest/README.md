# `@cohbrgr/jest`

This package provides a shared base Jest configuration for TypeScript projects within the Cohbrgr monorepo.

## Configuration Details

This configuration is designed to work seamlessly with TypeScript and handle various asset types during testing.

- **Preset**: Uses `ts-jest/presets/default-esm` for TypeScript support with ECMAScript Modules (ESM).
- **Transform**: Configures `ts-jest` to transform `.ts` and `.tsx` files, enabling ESM usage.
- **Module Name Mapper**: Handles module resolution for non-JavaScript assets and source aliases:
    - **Asset Stubbing**: Maps common non-JavaScript files (e.g., `.css`, `.scss`, `.png`, `.jpg`, `.ttf`) to `jest-transform-stub`. This prevents Jest from trying to parse these files as JavaScript during tests.
    - **Source Alias**: Maps `^src/(.*)$` to `<rootDir>/src/$1`. This allows you to use absolute imports starting from `src/` in your tests, mirroring the application's import structure.

## Usage

To use this Jest configuration in a project, extend it in your project's `jest.config.ts` file:

```typescript
import type { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from '@cohbrgr/jest';

const jestConfig: JestConfigWithTsJest = {
    ...baseConfig,
    displayName: 'my-project',
    // Add any project-specific configurations here
    // For example, test environment, setup files, etc.
    testEnvironment: 'jsdom',
};

export default jestConfig;
```
