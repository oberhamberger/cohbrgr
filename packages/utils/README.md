# @cohbrgr/utils

This package provides general-purpose utility functions and constants used across the cohbrgr monorepo.

## Installation

```bash
pnpm add @cohbrgr/utils
```

## Exports

| Export            | Type     | Description                           |
| ----------------- | -------- | ------------------------------------- |
| `Logger`          | Object   | Pre-configured Winston logger         |
| `findProcessArgs` | Function | Check for CLI arguments               |
| `isProduction`    | Constant | `true` if `NODE_ENV === 'production'` |
| `isDevelopment`   | Constant | `true` if not production              |

## Constants

### `isProduction`

Boolean indicating if the application is running in production mode.

```typescript
import { isProduction } from '@cohbrgr/utils';

if (isProduction) {
    // Production-only code
}
```

### `isDevelopment`

Boolean indicating if the application is running in development mode.

```typescript
import { isDevelopment } from '@cohbrgr/utils';

if (isDevelopment) {
    // Development-only code (e.g., debug logging)
}
```

## Functions

### `findProcessArgs(searchArgs: string | string[]): boolean`

Checks if specific arguments are present in `process.argv`.

**Parameters:**

- `searchArgs` - A string or array of strings to search for

**Returns:** `true` if any argument is found, `false` otherwise

```typescript
import { findProcessArgs } from '@cohbrgr/utils';

// Check for a single argument
if (findProcessArgs('--debug')) {
    console.log('Debug mode enabled');
}

// Check for multiple possible arguments
if (findProcessArgs(['--verbose', '-v'])) {
    console.log('Verbose output requested');
}
```

## Logger

### `Logger`

A pre-configured Winston logger instance for consistent logging across applications.

**Configuration:**

- **Level**: `info` (logs `info`, `warn`, `error`)
- **Format**: Timestamp + uppercase level + message, colorized
- **Transport**: Console output

**Available methods:**

| Method             | Level | When to use                                  |
| ------------------ | ----- | -------------------------------------------- |
| `Logger.error()`   | 0     | Errors that need attention                   |
| `Logger.warn()`    | 1     | Warnings about potential issues              |
| `Logger.info()`    | 2     | General informational messages               |
| `Logger.verbose()` | 3     | Detailed information (requires level change) |
| `Logger.debug()`   | 4     | Debug information (requires level change)    |

```typescript
import { Logger } from '@cohbrgr/utils';

Logger.info('Server started');
Logger.warn('Cache miss for key: user-123');
Logger.error('Database connection failed');
```

**Output format:**

```
2024-01-15 10:30:00 [INFO] Server started
2024-01-15 10:30:01 [WARN] Cache miss for key: user-123
2024-01-15 10:30:02 [ERROR] Database connection failed
```

## Usage Example

```typescript
import {
    findProcessArgs,
    isDevelopment,
    isProduction,
    Logger,
} from '@cohbrgr/utils';

// Environment-aware configuration
const config = {
    logLevel: isDevelopment ? 'debug' : 'info',
    cacheEnabled: isProduction,
};

// CLI argument handling
if (findProcessArgs('--dry-run')) {
    Logger.info('Running in dry-run mode');
}

Logger.info(`Starting in ${isProduction ? 'production' : 'development'} mode`);
```
