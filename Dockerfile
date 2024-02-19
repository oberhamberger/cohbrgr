FROM node:21-alpine
# source image info: https://hub.docker.com/_/node/

COPY --chown=root:root --chmod=644 . /usr/app
WORKDIR /usr/app

RUN npm ci
RUN npm run build:compiler
RUN npm run build

ENTRYPOINT ["node", "."]