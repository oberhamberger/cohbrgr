# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:25-alpine AS builder
WORKDIR /usr/app

COPY . .

ENV DOCKER=true
RUN npm install -g pnpm
RUN pnpm install

ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID
RUN pnpm run build:content

# Keep only production deps for the runtime image
RUN pnpm prune --prod --force

# ---------- runtime ----------
FROM node:25-alpine AS runtime
WORKDIR /usr/app

# Bring over built artifacts + pruned prod deps
COPY --from=builder /usr/app /usr/app

USER node

ENV NODE_ENV=production
ENV DOCKER=true
ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID

ENTRYPOINT ["node", "apps/content"]
