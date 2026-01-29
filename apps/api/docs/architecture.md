# Architecture

## Overview

The API follows a modular architecture where each domain (navigation, translation) is self-contained with its own routes, controllers, services, and middleware.

```
src/
├── modules/           # Feature modules (navigation, translation)
├── server.ts          # Express app configuration
└── index.ts           # Entry point
data/                  # Static JSON data files
env/                   # Environment configuration
```

## Module Pattern

Each module encapsulates a single domain:

- **Routes** define endpoints and wire up middleware
- **Controllers** handle HTTP concerns (request parsing, response formatting)
- **Services** contain business logic and data access
- **Middleware** handles cross-cutting concerns specific to the module

This separation keeps modules testable and allows swapping implementations (e.g., replacing static JSON with a database) without changing the controller layer.

## Why Static Data Files

Data is served from JSON files in `data/` rather than a database because:

1. Content changes infrequently
2. Simplifies deployment (no database dependency)
3. Data can be version-controlled
4. Enables offline-first architecture in the frontend

For dynamic content, services can be modified to fetch from external sources while keeping the same controller interface.

## Shared Utilities

Common functionality lives in `@cohbrgr/server` to be reused across all server applications:

- Request logging
- HTTP method restrictions
- ETag-based response caching
- Health check endpoints
- Error handling

This keeps the API focused on its domain logic.
