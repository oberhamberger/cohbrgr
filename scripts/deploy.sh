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

# Run gcloud builds submit synchronously, piping all output (stdout + stderr)
# through sed to filter gcloud CLI noise. The pipe is key: child processes
# (like gcloud's background update checker) inherit the pipe fd instead of
# the terminal, so their output is also captured and filtered.
if gcloud builds submit \
    --project="$PROJECT_ID" \
    --config=cloudbuild.yaml \
    --substitutions="_DEPLOY=$DEPLOY_FLAG,COMMIT_SHA=$COMMIT_SHA" 2>&1 \
    | sed -u '/^Safe-chain:/d; /^E0000.*ssl_transport/d; /^E0000.*secure_endpoint/d; /^WARNING.*absl/d; /^Unknown error.*Stream removed/d'; then
    echo ""
    echo "Build completed successfully."
else
    echo ""
    echo "Build failed. Check the Cloud Build console for details."
    exit 1
fi
