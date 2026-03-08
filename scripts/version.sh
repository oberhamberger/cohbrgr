#!/usr/bin/env bash
set -euo pipefail

# CalVer version bump script
# Format: YYYY.MM.PATCH
# Usage:
#   ./scripts/version.sh          # bump patch (e.g. 2026.03.0 → 2026.03.1)
#   ./scripts/version.sh minor    # new month (e.g. 2026.03.1 → 2026.04.0)
#   ./scripts/version.sh 2026.05.0  # set explicit version

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

current_version=$(node -p "require('$ROOT_DIR/package.json').version")
echo "Current version: $current_version"

if [[ $# -eq 0 ]]; then
    # Bump patch: 2026.03.0 → 2026.03.1
    IFS='.' read -r year month patch <<< "$current_version"
    new_version="$year.$month.$((patch + 1))"
elif [[ "$1" == "minor" ]]; then
    # New month: 2026.03.1 → 2026.04.0
    year=$(date +%Y)
    month=$(date +%-m)
    new_version="$year.$month.0"
else
    # Explicit version
    new_version="$1"
fi

echo "New version: $new_version"

# Update all package.json files
for pkg in \
    "$ROOT_DIR/package.json" \
    "$ROOT_DIR"/packages/*/package.json \
    "$ROOT_DIR"/apps/*/package.json; do
    if [[ -f "$pkg" ]]; then
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$new_version\"/" "$pkg"
        echo "  Updated: ${pkg#$ROOT_DIR/}"
    fi
done

echo "Done."
