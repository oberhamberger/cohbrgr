# cohbrgr

Small Express Server running in a Docker-Container, serving static HTML Files.

## Developing



build locally: 
```
npm run build
```
run build: 
```
node dist
```
run locally: 
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