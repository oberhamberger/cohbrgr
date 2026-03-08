#!/usr/bin/env bash
set -euo pipefail

# CalVer version bump script
# Format: YYYY.M.PATCH (no leading zeros — required for semver compatibility)
# Usage:
#   ./scripts/version.sh          # bump patch (e.g. 2026.3.0 → 2026.3.1)
#   ./scripts/version.sh minor    # new month (e.g. 2026.3.1 → 2026.4.0)
#   ./scripts/version.sh 2026.5.0 # set explicit version

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

current_version=$(node -p "require('$ROOT_DIR/package.json').version")
echo "Current version: $current_version"

if [[ $# -eq 0 ]]; then
    # Bump patch: 2026.3.0 → 2026.3.1
    IFS='.' read -r year month patch <<< "$current_version"
    new_version="$year.$month.$((patch + 1))"
elif [[ "$1" == "minor" ]]; then
    # New month: 2026.3.1 → 2026.4.0
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
    "$ROOT_DIR"/apps/*/package.json \
    "$ROOT_DIR"/e2e/package.json; do
    if [[ -f "$pkg" ]]; then
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$new_version\"/" "$pkg"
        echo "  Updated version: ${pkg#$ROOT_DIR/}"
    fi
done

echo "Done."
