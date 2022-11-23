FROM node:19-alpine
# source image info: https://hub.docker.com/_/node/

USER node
COPY --chown=node:node . /usr/app
WORKDIR /usr/app

RUN npm ci
RUN npm run build

ENTRYPOINT ["node", "."]