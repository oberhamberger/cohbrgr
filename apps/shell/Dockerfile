# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:24-alpine AS builder
WORKDIR /usr/app

COPY --chown=node:node . .

ENV DOCKER=true
USER node

RUN npm ci

ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID
RUN npm run build:shell

# Keep only prod deps
RUN npm prune --omit=dev

# ---------- runtime ----------
FROM node:24-alpine AS runtime
WORKDIR /usr/app

COPY --from=builder /usr/app /usr/app

USER node

ENV NODE_ENV=production
ENV DOCKER=true
ENV GCLOUD_RUN=$PROJECT_ID

ENTRYPOINT ["node", "apps/shell"]
