FROM monorepo-base:latest
# source image info: https://hub.docker.com/_/node/

USER node
COPY --chown=node:node . /usr/app
WORKDIR /usr/app/apps/shell

RUN npm run build

ENTRYPOINT ["node", "."]