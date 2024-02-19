FROM node:21-alpine
# source image info: https://hub.docker.com/_/node/

USER node
COPY --chown=node:node . /usr/app
WORKDIR /usr/app

RUN npm install
RUN npm run build:compiler
RUN chmod +x packages/build/bin/index.js

RUN npm run build:shell

ENTRYPOINT ["node", "."]