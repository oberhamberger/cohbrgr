# syntax=docker/dockerfile:1.6
FROM node:25-slim

# 1. Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        build-essential \
        python3 \
        openssh-client \
        && rm -rf /var/lib/apt/lists/*

# 2. Install pnpm directly via npm
# We use --before to bypass the corepack/shim conflicts 
RUN npm install -g pnpm@latest

# 3. Configure pnpm environment
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /workspaces/cohbrgr

# 4. Setup permissions for the node user
USER node

# Create the pnpm home and set the store directory
RUN mkdir -p /home/node/.local/share/pnpm && \
    pnpm config set store-dir /home/node/.local/share/pnpm/store
