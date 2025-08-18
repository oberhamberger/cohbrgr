# `@cohbrgr/utils`

This package provides a collection of general-purpose utility functions and modules used across the Cohbrgr monorepo.

## Overview

This package aims to centralize common helper functions, making them easily reusable and maintaining consistency throughout the codebase.

## Utilities

### `findProcessArgs(searchArgs: string | string[]): boolean`

A utility function to check if specific arguments are present in the Node.js `process.argv` array.

-   **`searchArgs`**: A string or an array of strings representing the arguments to search for.
-   **Returns**: `true` if any of the `searchArgs` are found in `process.argv`, `false` otherwise.

#### Usage

```typescript
import { findProcessArgs } from '@cohbrgr/utils';

// Check if a single argument is present
if (findProcessArgs('--debug')) {
    console.log('Debug mode is enabled.');
}

// Check if any of multiple arguments are present
if (findProcessArgs(['--verbose', '-v'])) {
    console.log('Verbose output requested.');
}
```

### `Logger`

A pre-configured Winston logger instance for consistent logging across applications.

-   **Level**: `info` - Logs messages at `info` level and above (i.e., `info`, `warn`, `error`).
-   **Format**: Includes timestamp, log level (uppercase), and message. Output is colorized for better readability in the console.
-   **Transports**: Currently configured to log to the console.

#### Available Log Levels (from Winston):

-   `error` (0)
-   `warn` (1)
-   `info` (2)
-   `verbose` (3)
-   `debug` (4)
-   `silly` (5)

#### Usage

```typescript
import { Logger } from '@cohbrgr/utils';

Logger.info('This is an informational message.');
Logger.warn('A warning has occurred.');
Logger.error('An error message.');
Logger.debug('This will only show if the log level is set to debug or lower.');
```
