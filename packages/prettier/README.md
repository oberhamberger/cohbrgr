# `@cohbrgr/prettier`

This package provides the shared Prettier configuration for all projects within the Cohbrgr monorepo.

## Configuration Details

This configuration ensures consistent code formatting across the entire codebase.

- **`trailingComma`**: `all` - Adds trailing commas wherever valid in ES5 (objects, arrays, etc.).
- **`tabWidth`**: `4` - Sets the number of spaces per indentation level to 4.
- **`semi`**: `true` - Prints semicolons at the end of statements.
- **`singleQuote`**: `true` - Uses single quotes instead of double quotes.

Import order is **not** handled by Prettier; it is enforced by ESLint (`@cohbrgr/eslint`) to avoid conflicts and keep a single source of truth. Run `pnpm run lint --fix` to fix import order.

## Usage

To use this Prettier configuration in a project, you can reference it in your project's `package.json` or `prettier.config.js`.

### Example `package.json`

```json
{
    "name": "my-project",
    "prettier": "@cohbrgr/prettier"
}
```

### Example `prettier.config.js`

```javascript
// prettier.config.js
module.exports = require('@cohbrgr/prettier');
```

Alternatively, you can simply have a `prettier.config.js` file at the root of your project that exports this configuration, as it is already set up to be consumed directly.
