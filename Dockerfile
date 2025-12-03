# syntax=docker/dockerfile:1.6

FROM node:25-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        build-essential \
        python3 \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/cohbrgr

USER node
