# Getting Started

This guide walks you through setting up your development environment and running the applications.

## Prerequisites

- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)
- [pnpm](https://pnpm.io/) (version specified in `package.json` `packageManager` field)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/oberhamberger/cohbrgr.git
    cd cohbrgr
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Build all packages:

    ```bash
    pnpm run build
    ```

    This builds packages in dependency order (build tools first, then apps).

## Development

Start all applications in development mode with hot reloading:

```bash
pnpm run dev
```

This starts:

| App     | URL                   | Description            |
| ------- | --------------------- | ---------------------- |
| shell   | http://localhost:3030 | Main SSR application   |
| content | http://localhost:3031 | Content micro-frontend |
| api     | http://localhost:3032 | REST API server        |

To run a single app in development mode:

```bash
pnpm run dev:shell
pnpm run dev:content
pnpm run dev:api
```

## Production Build

Build all applications for production:

```bash
pnpm run build
```

Serve the production build:

```bash
pnpm run serve
```

## Common Commands

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `pnpm install`       | Install all dependencies                                 |
| `pnpm run bootstrap` | Clean rebuild (removes node_modules, reinstalls, builds) |
| `pnpm run dev`       | Start all apps in development mode                       |
| `pnpm run build`     | Build all packages and apps                              |
| `pnpm run serve`     | Serve production builds                                  |
| `pnpm run test`      | Run all tests                                            |
| `pnpm run lint`      | Run ESLint across all packages                           |
| `pnpm run prettier`  | Format code with Prettier                                |
| `pnpm run graph`     | Visualize the dependency graph                           |

## Troubleshooting

### Build fails with missing dependencies

The `@cohbrgr/build` package must be built before other packages. Run a full build:

```bash
pnpm run build
```

### Port already in use

Check if another process is using ports 3030, 3031, or 3032:

```bash
lsof -i :3030
```

### Clean slate

If things are in a broken state, run bootstrap to start fresh:

```bash
pnpm run bootstrap
```

This removes all generated files and node_modules, then reinstalls and rebuilds everything.
