# cohbrgr

A small Express server written in Typescript running in a Docker-Container, serving a server-side rendered React Application.
This Repository is meant to be used for experimentation and trying out stuff, without relying on create-react-app or Next.js.

## Installing

```
npm install
```

## Developing

build locally:

```
npm run build
```

run server (after first build):

```
node .
```

develop locally:

```
npm start
```

## Docker

Since the application is split into multiple microfrontends, you will need to run these apps in their respective containers.

build a Docker-Container:

```
docker build --tag node-[APP] -f Dockerfile.[APP] .
```

run as Docker-Container:

```
docker run -d -p 3000:3000 node-[APP]
```

## Messed Around With

- Minimal React Single Page Application
- NodeJS Express Server providing SSR
- Module Federation
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

## forever ignored

- Internet Explorer Support
