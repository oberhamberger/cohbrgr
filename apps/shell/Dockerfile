# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:24-alpine AS builder
WORKDIR /usr/app

COPY . .

ENV DOCKER=true
RUN npm ci

ARG PROJECT_ID
RUN npm run build:shell

RUN npm prune --omit=dev

# ---------- runtime ----------
FROM node:24-alpine AS runtime
WORKDIR /usr/app

COPY --from=builder /usr/app /usr/app

USER node

ENV NODE_ENV=production
ENV DOCKER=true

ENTRYPOINT ["node", "apps/shell"]