# cohbrgr

A small Express server written in Typescript running in a Docker-Container, serving a server-side rendered React Application.
This Repository is meant to be used for experimentation and trying out stuff, without relying on create-react-app or Next.js.

## Installing

```
pnpm install
```

## Developing

build locally:

```
pnpm run build
```

run server (after first build):

```
node .
```

develop locally:

```
pnpm start
```

## Docker

Since the application is split into multiple microfrontends, you will need to run these apps in their respective containers.

build a Docker-Container:

```
docker build --tag node-[APP] -f ./[APP]/Dockerfile .
```

run as Docker-Container:

```
docker run -d -p 3000:3000 node-[APP]
```

## Messed Around With

- Minimal React Single Page Application
- NodeJS Express Server providing SSR
- Module Federation on Server and Client
- Static Site Generation
- SCSS Modules Styles
- Typescript
- Webpack Bundling
- Monorepositories
- Serviceworker using Workbox (for offline-Mode)
- Linting
- Prettier
- Jest + React Testing Library
- and of course: dark mode

## CI/CD

This project uses GitHub Actions for continuous integration. The following checks run automatically:

- Linting: Ensures code style consistency
- Build: Verifies the project builds successfully
- Tests: Runs the test suite

The CI pipeline runs on:

- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

## forever ignored

- Internet Explorer Support
