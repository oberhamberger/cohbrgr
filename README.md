# cohbrgr

A small Express server written in Typescript running in a Docker-Container, serving static HTML Files.

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
node .
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
