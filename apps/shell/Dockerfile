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
RUN pnpm run build:shell

# Force injection ONLY for the deploy step
RUN NPM_CONFIG_INJECT_WORKSPACE_PACKAGES=true pnpm deploy --filter=./apps/shell --prod /prod/shell
RUN cp -r apps/shell/dist /prod/shell/dist

# ---------- runtime ----------
FROM node:24-slim AS runtime
WORKDIR /prod/shell

COPY --from=builder /prod/shell /prod/shell

USER node

ENV NODE_ENV=production
ENV DOCKER=true
ENV GCLOUD_RUN=$PROJECT_ID

ENTRYPOINT ["node", "."]
