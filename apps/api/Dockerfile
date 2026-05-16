# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:26-slim AS builder
WORKDIR /usr/app

COPY . .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CLOUD_RUN=true
ENV CI=true

RUN npm install -g corepack && corepack enable
RUN pnpm install --frozen-lockfile

ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID
RUN pnpm run build:api

RUN pnpm deploy --legacy --filter=./apps/api --prod /prod/api
RUN cp -r apps/api/dist /prod/api/dist

# ---------- runtime ----------
FROM node:26-slim AS runtime
WORKDIR /prod/api

COPY --from=builder /prod/api /prod/api

USER node

ENV NODE_ENV=production
ENV CLOUD_RUN=true
ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID

ENTRYPOINT ["node", "."]
