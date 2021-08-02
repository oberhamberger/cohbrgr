# cohbrgr

A small Express server written in Typescript running in a Docker-Container, serving static HTML Files.
There is no build process outside of typescript compilation and copying over some files with npm scripts.
This also means that there is no production build available right now.

## Installing

```
npm install
```

## Developing

build locally:

```
npm run build
```

run server:

```
node dist
```

develop locally:

```
npm start
```

## Docker

build Docker-Container:

```
docker build --tag node-docker .
```

run as Docker-Container:

```
docker run -d -p 3000:3000 node-docker
```
