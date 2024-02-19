FROM node:21-alpine
# source image info: https://hub.docker.com/_/node/

USER node
COPY --chown=node:node . /usr/app
WORKDIR /usr/app

RUN npm ci --ignore-scripts
RUN npm run build:compiler
RUN npm run build

ENTRYPOINT ["node", "."]