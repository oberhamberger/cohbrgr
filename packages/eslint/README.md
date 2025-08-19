# `@cohbrgr/eslint`

This package provides the base ESLint configuration for all TypeScript and React projects within the Cohbrgr monorepo.

## Configuration Details

This configuration extends and combines several popular ESLint setups:

- **Base ESLint Recommended Rules**: Standard recommended rules from ESLint.
- **TypeScript ESLint Recommended Rules**: Recommended rules specifically for TypeScript codebases.
- **Prettier Integration**: Uses `eslint-config-prettier` to disable ESLint rules that conflict with Prettier, ensuring smooth integration between linting and code formatting.

### Specific Rules and Features

- **Ignored Paths**: Automatically ignores `dist` and `node_modules` directories from linting.
- **TypeScript Parsing**: Configures `parserOptions` for TypeScript files (`.ts`, `.tsx`) to correctly resolve `tsconfig.json`.
- **Import Order**: Enforces a consistent import order using `eslint-plugin-import` with the following group order:
    - `builtin`
    - `external`
    - `internal`
    - `parent`
    - `sibling`
    - `index`
      Imports are alphabetized within each group.

## Usage

To use this ESLint configuration in a project, extend it in your project's ESLint configuration file (e.g., `eslint.config.mjs`):

```javascript
import { config } from '@cohbrgr/eslint';

export default [
    ...config,
    // Project-specific overrides or additional configurations
];
```
