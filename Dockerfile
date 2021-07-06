FROM node:16-alpine
# source image info: https://hub.docker.com/_/node/

USER node
COPY --chown=node:node . /usr/app
WORKDIR /usr/app

RUN npm install
RUN npm run build

ENTRYPOINT ["node", "."]