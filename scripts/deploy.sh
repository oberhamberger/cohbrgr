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

if [[ "$DRY_RUN" == "true" ]]; then
    echo "Dry run: building images only (no deploy)."
    gcloud builds submit \
        --project="$PROJECT_ID" \
        --config=cloudbuild.yaml \
        --substitutions="_DEPLOY=false,COMMIT_SHA=$COMMIT_SHA"
else
    echo "This will deploy to production (https://cohbrgr.com)."
    read -rp "Continue? [y/N] " confirm
    if [[ "$confirm" != [yY] ]]; then
        echo "Aborted."
        exit 0
    fi

    gcloud builds submit \
        --project="$PROJECT_ID" \
        --config=cloudbuild.yaml \
        --substitutions="_DEPLOY=true,COMMIT_SHA=$COMMIT_SHA"
fi
