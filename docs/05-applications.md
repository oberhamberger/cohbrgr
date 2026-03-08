# Applications

Applications are deployable units located in `/apps`. Each app can be built, tested, and deployed independently.

## @cohbrgr/shell

The shell is the host application that provides the overall page structure and orchestrates micro-frontends.

**Location**: `apps/shell/`

### Responsibilities

- Server-side rendering of the initial page
- Loading and composing micro-frontends via Module Federation
- Routing and navigation
- Global layout (header, footer, etc.)
- Service worker for offline support

### Structure

```
apps/shell/
├── src/
│   ├── client/           # Browser-side code
│   │   ├── components/   # Shell-specific components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Route pages
│   │   └── routes.ts     # Route definitions
│   └── server/           # Server-side code
│       ├── middleware/   # Express middleware
│       └── template/     # HTML template components
├── build/                # Rspack configurations
└── env/                  # Environment configuration
```

### Commands

```bash
pnpm run dev:shell      # Development with hot reload
pnpm run build:shell    # Production build
pnpm run serve:shell    # Serve production build
```

### Ports

| Mode        | Port |
| ----------- | ---- |
| Development | 3030 |
| Production  | 3000 |

---

## @cohbrgr/content

The content app is a remote micro-frontend that exposes components for the shell to consume.

**Location**: `apps/content/`

### Responsibilities

- Exposing the `Content` component via Module Federation
- Rendering structured content sections
- Managing content-specific state

### Structure

```
apps/content/
├── src/
│   ├── client/           # Browser-side code
│   │   ├── components/   # Content components
│   │   └── App.tsx       # Root component
│   └── server/           # Server-side code
│       └── middleware.ts # SSR middleware
├── build/                # Rspack configurations
└── env/                  # Environment configuration
```

### Exposed Modules

| Module      | Path                                        | Description            |
| ----------- | ------------------------------------------- | ---------------------- |
| `./Content` | `src/client/components/content/Content.tsx` | Main content component |

### Commands

```bash
pnpm run dev:content      # Development with hot reload
pnpm run build:content    # Production build
pnpm run serve:content    # Serve production build
```

### Ports

| Mode        | Port |
| ----------- | ---- |
| Development | 3031 |
| Production  | 3001 |

---

## @cohbrgr/api

The API app provides REST endpoints for data that the frontend applications consume.

**Location**: `apps/api/`

### Responsibilities

- Navigation data endpoint
- Translation/i18n data endpoint
- Centralized data management

### Structure

```
apps/api/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── navigation/   # Navigation endpoints
│   │   └── translation/  # Translation endpoints
│   ├── server.ts         # Express app setup
│   └── index.ts          # Entry point
├── data/                 # Static data files
│   ├── navigation.json
│   └── translations.json
└── env/                  # Environment configuration
```

### Endpoints

| Method | Path                | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/navigation`   | Navigation menu data |
| GET    | `/api/translations` | i18n strings         |
| GET    | `/health`           | Health check         |

### Commands

```bash
pnpm run dev:api      # Development with hot reload
pnpm run build:api    # Production build
pnpm run serve:api    # Serve production build
```

### Ports

| Mode        | Port |
| ----------- | ---- |
| Development | 3032 |
| Production  | 3002 |

---

## Port Configuration

Ports are determined at **build time** based on `NODE_ENV`. The port value is inlined into the bundle during compilation, not read at runtime.

### Summary Table

| Application | Development (`pnpm run dev`) | Production (`pnpm run serve`) |
| ----------- | ---------------------------- | ----------------------------- |
| Shell       | 3030                         | 3000                          |
| Content     | 3031                         | 3001                          |
| API         | 3032                         | 3002                          |

### How It Works

The `env/index.ts` file in each app uses environment variables that Rspack's DefinePlugin inlines at build time:

```typescript
// apps/*/env/index.ts
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

export const internalConfig = {
    local: {
        port: isProduction ? 3000 : 3030,
        apiUrl: isProduction
            ? 'http://localhost:3002'
            : 'http://localhost:3032',
    },
    docker: {
        port: 3000,
        apiUrl: 'https://cohbrgr-api-....run.app',
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
```

This means:

- `pnpm run dev` (NODE_ENV=development) → local dev config (port 303x)
- `pnpm run build` (NODE_ENV=production) → local production config (port 300x)
- `DOCKER=true pnpm run build` → Docker/GCP config (cloud URLs)

### Verification

Run the port verification script to ensure ports are configured correctly:

```bash
./scripts/verify-ports.sh
```
