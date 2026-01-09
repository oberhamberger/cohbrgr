# syntax=docker/dockerfile:1.6

# ---------- builder ----------
FROM node:24-slim AS builder
WORKDIR /usr/app

COPY . .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV DOCKER=true
ENV CI=true

RUN corepack enable
RUN pnpm install --frozen-lockfile

ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID
RUN pnpm run build:content

# Force injection ONLY for the deploy step
RUN NPM_CONFIG_INJECT_WORKSPACE_PACKAGES=true pnpm deploy --filter=./apps/content --prod /prod/content
RUN cp -r apps/content/dist /prod/content/dist

# ---------- runtime ----------
FROM node:24-slim AS runtime
WORKDIR /prod/content

COPY --from=builder /prod/content /prod/content

USER node

ENV NODE_ENV=production
ENV DOCKER=true
ARG PROJECT_ID
ENV GCLOUD_RUN=$PROJECT_ID

ENTRYPOINT ["node", "."]
