#!/usr/bin/env bash
set -euo pipefail

# Kill any lingering gcloud child processes on exit so their update checker
# doesn't print noise (Safe-chain timeout) after the script finishes
cleanup() {
    pkill -P $$ 2>/dev/null || true
}
trap cleanup EXIT

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

# Submit build asynchronously, then stream logs with gcloud noise filtered out
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

# Stream build logs, annotating any gcloud CLI noise
gcloud beta builds log --stream --project="$PROJECT_ID" "$BUILD_ID" 2>/dev/null \
    | while IFS= read -r line; do
        if [[ "$line" == Safe-chain:* ]]; then
            echo "(gcloud update check timed out — this is harmless, run 'gcloud components update' manually)"
        else
            echo "$line"
        fi
    done || true

# Check final build status (head -1 filters any gcloud noise after the status value)
STATUS=$(gcloud builds describe "$BUILD_ID" \
    --project="$PROJECT_ID" \
    --format='value(status)' 2>/dev/null | head -1) || true

echo ""
if [[ "$STATUS" == "SUCCESS" ]]; then
    echo "Build completed successfully."
else
    echo "Build failed with status: $STATUS"
    echo "View logs: $CONSOLE_URL"
    exit 1
fi
