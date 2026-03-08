# `@cohbrgr/env`

Shared environment constants for the Cohbrgr monorepo. Provides a single source of truth for port numbers, Cloud Run origins, and the production domain, eliminating duplication across apps and build configs.

## Exports

### `ports`

Port assignments per application and environment.

```typescript
import { ports } from '@cohbrgr/env';

ports.shell.dev; // 3030
ports.shell.prod; // 3000
ports.content.dev; // 3031
ports.content.prod; // 3001
ports.api.dev; // 3032
ports.api.prod; // 3002
```

### `cloudRunOrigins`

Google Cloud Run deployment origins (without trailing slashes).

```typescript
import { cloudRunOrigins } from '@cohbrgr/env';

cloudRunOrigins.shell; // https://cohbrgr-o44imzpega-oa.a.run.app
cloudRunOrigins.content; // https://cohbrgr-content-o44imzpega-oa.a.run.app
cloudRunOrigins.api; // https://cohbrgr-api-944962437395.europe-west6.run.app
```

### `productionDomain`

The public-facing production domain.

```typescript
import { productionDomain } from '@cohbrgr/env';

productionDomain; // https://cohbrgr.com
```

## Usage

Each app imports these constants into its own `env/index.ts` and builds its configuration independently:

```typescript
// apps/shell/env/index.ts
import { cloudRunOrigins, ports } from '@cohbrgr/env';

const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

const internalConfig = {
    local: {
        port: isProduction ? ports.shell.prod : ports.shell.dev,
        location: 'http://localhost',
        apiUrl: isProduction
            ? `http://localhost:${ports.api.prod}`
            : `http://localhost:${ports.api.dev}`,
    },
    docker: {
        port: ports.shell.prod,
        location: `${cloudRunOrigins.shell}/`,
        apiUrl: cloudRunOrigins.api,
    },
};

export const Config = isDocker ? internalConfig.docker : internalConfig.local;
```

## Design Principles

- **Constants only** — no logic, no environment detection, no side effects
- **Apps own their config** — each app decides how to combine these values
- **Single source of truth** — changing a port or URL only requires editing one file
