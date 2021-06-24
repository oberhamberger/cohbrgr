FROM node:12-alpine
# source image info: https://hub.docker.com/_/node/

RUN mkdir -p /opt
WORKDIR /opt

COPY . .

RUN npm install
RUN npm run build

ENTRYPOINT ["node", "."]