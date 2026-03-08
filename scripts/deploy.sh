#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="cohb-9fa5f"
COMMIT_SHA=$(git rev-parse HEAD)
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --dry-run) DRY_RUN=true ;;
        *) echo "Unknown argument: $arg"; exit 1 ;;
    esac
done

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Error: Working tree is dirty. Commit or stash changes before deploying."
    exit 1
fi

echo "Project:    $PROJECT_ID"
echo "Commit:     $COMMIT_SHA"
echo "Dry run:    $DRY_RUN"
echo ""

DEPLOY_FLAG="true"
if [[ "$DRY_RUN" == "true" ]]; then
    DEPLOY_FLAG="false"
    echo "Dry run: building images only (no deploy)."
else
    echo "This will deploy to production (https://cohbrgr.com)."
    read -rp "Continue? [y/N] " confirm
    if [[ "$confirm" != [yY] ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Submit build asynchronously and poll status
# Log streaming (both Cloud Storage and Cloud Logging) has gRPC/SSL bugs in
# the gcloud CLI that produce noisy errors. Polling avoids this entirely.
BUILD_ID=$(gcloud builds submit \
    --project="$PROJECT_ID" \
    --config=cloudbuild.yaml \
    --substitutions="_DEPLOY=$DEPLOY_FLAG,COMMIT_SHA=$COMMIT_SHA" \
    --async \
    --format='value(id)')

CONSOLE_URL="https://console.cloud.google.com/cloud-build/builds/$BUILD_ID?project=$PROJECT_ID"
echo "Build ID:   $BUILD_ID"
echo "Console:    $CONSOLE_URL"
echo ""
echo "Waiting for build to complete..."

while true; do
    STATUS=$(gcloud builds describe "$BUILD_ID" \
        --project="$PROJECT_ID" \
        --format='value(status)' 2>/dev/null) || true

    case "$STATUS" in
        SUCCESS)
            echo "Build completed successfully."
            exit 0
            ;;
        FAILURE|TIMEOUT|CANCELLED|INTERNAL_ERROR)
            echo "Build failed with status: $STATUS"
            echo "View logs: $CONSOLE_URL"
            exit 1
            ;;
        *)
            printf "."
            sleep 15
            ;;
    esac
done
