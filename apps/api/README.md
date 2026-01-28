# API Application

The `@cohbrgr/api` application is a REST API server that provides data endpoints for the frontend applications. It serves navigation structure and internationalization (i18n) translations.

## Architecture

The API follows a modular architecture with separate modules for each domain:

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── navigation/       # Navigation data endpoints
│   │   │   ├── controller/   # Request handlers
│   │   │   ├── services/     # Business logic
│   │   │   └── navigation.routes.ts
│   │   └── translation/      # i18n endpoints
│   │       ├── controller/   # Request handlers
│   │       ├── middleware/   # Language validation
│   │       ├── service/      # Business logic
│   │       └── translation.routes.ts
│   ├── utils/                # Shared utilities
│   ├── server.ts             # Express app setup
│   └── index.ts              # Entry point
├── data/                     # Static JSON data files
│   ├── navigation.json
│   └── translations.json
└── env/                      # Environment configuration
```

## Endpoints

### Navigation

| Method | Path                  | Description                                    |
| ------ | --------------------- | ---------------------------------------------- |
| GET    | `/navigation`         | Returns full navigation tree                   |
| GET    | `/navigation/:nodeId` | Returns navigation subtree for a specific node |

### Translation

| Method | Path                 | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/translation`       | Returns all translations for all languages   |
| GET    | `/translation/:lang` | Returns translations for a specific language |

The `:lang` parameter is validated by middleware to ensure only supported languages are accepted.

### Health

| Method | Path      | Description                  |
| ------ | --------- | ---------------------------- |
| GET    | `/health` | Returns server health status |

## Middleware Stack

The API uses the following middleware (in order):

1. **logging** - Request logging (from `@cohbrgr/server`)
2. **methodDetermination** - Restricts to GET/HEAD methods (from `@cohbrgr/server`)
3. **Express.json()** - JSON body parsing
4. **errorHandler** - Global error handling (from `@cohbrgr/server`)

## Configuration

### Environment Variables

| Variable   | Description                 | Default                     |
| ---------- | --------------------------- | --------------------------- |
| `NODE_ENV` | Environment mode            | `development`               |
| `PORT`     | Server port                 | `3032` (dev), `3002` (prod) |
| `DOCKER`   | Enable Docker configuration | -                           |

### Ports

| Mode        | Port |
| ----------- | ---- |
| Development | 3032 |
| Production  | 3002 |

## Commands

```bash
pnpm run dev:api      # Development with hot reload
pnpm run build:api    # Production build
pnpm run serve:api    # Serve production build
```

## Testing

The API includes unit tests for controllers and services:

```bash
# Run from monorepo root
pnpm run test         # Run all tests including API

# Run from api directory
cd apps/api
pnpm test
```

Test files follow the pattern `*.spec.ts` and are co-located with their source files.

## Data Files

The API serves data from static JSON files in the `data/` directory:

- **navigation.json** - Site navigation structure
- **translations.json** - i18n strings organized by language

In a production scenario, these could be replaced with database queries or external API calls.
