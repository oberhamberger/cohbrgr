# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:24-alpine AS builder
WORKDIR /usr/app

COPY --chown=node:node . .

ENV DOCKER=true
USER node

RUN npm ci

# Build the content app
RUN npm run build:content

# Keep only production deps for the runtime image
RUN npm prune --omit=dev

# ---------- runtime ----------
FROM node:24-alpine AS runtime
WORKDIR /usr/app

# Bring over built artifacts + pruned prod deps
COPY --from=builder /usr/app /usr/app

USER node

ENV NODE_ENV=production
ENV DOCKER=true

ENTRYPOINT ["node", "apps/content"]
