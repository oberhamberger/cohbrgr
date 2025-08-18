# `@cohbrgr/figma`

This package is responsible for managing and transforming design tokens, likely sourced from Figma, into code-ready formats (SCSS and CSS variables) using Style Dictionary.

## Overview

Design tokens are the single source of truth for design decisions. This package takes `tokens.json` (and any other JSON files within `src/`) as input, processes them, and outputs styling variables that can be consumed by the application's frontend.

## Configuration

The `config.json` file defines how the design tokens are processed:

-   **Source**: `src/**/*.json` - Specifies that all JSON files within the `src` directory (and its subdirectories) are considered as source files for design tokens.
-   **Platforms**:
    -   **SCSS**: Transforms tokens into SCSS variables. The output file is `_variables.scss` located in the `dist/scss/` directory.
    -   **CSS**: Transforms tokens into CSS custom properties (variables). The output file is `_variables.css` located in the `dist/css/` directory.

## Usage

Typically, this package would be used as part of a build process to generate the necessary styling files. After running the build process (which would involve Style Dictionary), the generated SCSS and CSS files can be imported into your frontend projects.

### Example (Conceptual)

Assuming a build script that runs Style Dictionary based on `config.json`:

```bash
npm run build:tokens
```

This would generate:

-   `dist/scss/_variables.scss`
-   `dist/css/_variables.css`

These files can then be imported into your stylesheets:

```scss
// In your SCSS files
@use '@cohbrgr/figma';

.my-component {
    color: $color-primary;
    font-size: $font-size-base;
}
```
