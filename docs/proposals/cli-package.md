# Publish `cohbrgr` CLI to npm

A terminal version of the website, published as the `cohbrgr` npm package.

## Motivation

The website already conveys the project's identity and content (translations, docs, architecture). A CLI exposes the same surface in a developer-native form: `npx cohbrgr` becomes a working business card, doc browser, and MCP entrypoint.

## Scope

Location: `apps/cli/`. Published as `cohbrgr` on npm with a `bin` entry so `npx cohbrgr` works without install.

Commands:

| Command                       | Behavior                                               |
| ----------------------------- | ------------------------------------------------------ |
| `cohbrgr`                     | Styled summary / business card                         |
| `cohbrgr content [--lang de]` | Fetch and display translations from the live API       |
| `cohbrgr docs [topic]`        | Render bundled `./docs` markdown via `marked-terminal` |
| `cohbrgr open`                | Open `cohbrgr.com` in the default browser              |
| `cohbrgr info`                | Display architecture / tech stack summary              |
| `cohbrgr mcp`                 | Start MCP server over stdio (for local agent use)      |
| `cohbrgr mcp --http`          | Start MCP server over HTTP/SSE (for remote deployment) |

Tech: TypeScript, Commander for arg parsing, Inquirer for prompts, spinners for loading states. Offline fallback caches translations locally.

The `mcp` subcommand exposes tools `search_docs`, `get_doc`, `get_architecture`, `get_translations`. These map directly onto the shared library's surface.

## Implementation

### Shared library (`packages/docs/`)

The CLI is thin. The data surface (docs indexing, translations fetching, architecture info) lives in a separate workspace package so it's testable in isolation and reusable. Pure TypeScript, no UI concerns.

Exports:

- A doc loader that reads and indexes the bundled `./docs` markdown files
- A translations client that fetches from the live API with a local-cache fallback
- An architecture / info data module (tech stack, package layout, app topology)
- Full-text search across docs

### CLI app (`apps/cli/`)

Commander entrypoint, one subcommand per command in the table above. Consumes `packages/docs` for content; only owns presentation and process lifecycle (spinners, stdio vs HTTP server, browser opening).

## Plan

Library first, then CLI on top:

1. Scaffold `packages/docs/` with TypeScript
2. Doc loader: read, parse, index bundled markdown
3. Translations client: live API with local-cache fallback
4. Architecture / info data module
5. Full-text search across docs
6. Scaffold `apps/cli/` with a Commander entrypoint
7. `content` command: fetch translations, format for terminal
8. `docs` command: render `./docs` via `marked-terminal`
9. `open` command
10. `info` command: pull from the library's architecture module
11. Styled default output (business card)
12. `mcp` command: stdio + HTTP/SSE modes, four tools listed above
13. `bin` field for `npx` support
14. Publish to npm

## Open Questions

- How are markdown files bundled into `packages/docs`? Copied at build time, or read via `import.meta` / `fs`? Affects whether the package is usable in browser contexts or Node-only.
- Search: ship a small in-memory index (lunr / minisearch), or stay grep-simple? Index size vs. relevance trade-off.
- Will the CLI bundle docs at build time, or fetch from a docs endpoint? Bundling makes it work offline by default; fetching keeps it always-current.
- Versioning: does the CLI track the website's CalVer, or get its own semver line?
