#!/usr/bin/env bash
set -eo pipefail

# Integration test script
# Builds and starts all three apps, runs smoke tests, then tears down.
# Usage: ./scripts/integration-test.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SHELL_PORT=3000
CONTENT_PORT=3001
API_PORT=3002
PIDS=()
PASSED=0
FAILED=0

cleanup() {
    echo ""
    echo "Shutting down servers..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    wait 2>/dev/null || true
}
trap cleanup EXIT

assert() {
    local description="$1"
    local result="$2"
    local expected="${3:-0}"

    if [[ "$result" == "$expected" ]]; then
        echo "  PASS: $description"
        PASSED=$((PASSED + 1))
    else
        echo "  FAIL: $description (got: $result, expected: $expected)"
        FAILED=$((FAILED + 1))
    fi
}

assert_contains() {
    local description="$1"
    local body="$2"
    local pattern="$3"

    if echo "$body" | grep -q "$pattern"; then
        echo "  PASS: $description"
        PASSED=$((PASSED + 1))
    else
        echo "  FAIL: $description (pattern '$pattern' not found)"
        FAILED=$((FAILED + 1))
    fi
}

wait_for_server() {
    local port=$1
    local name=$2
    local max_attempts=30

    for i in $(seq 1 $max_attempts); do
        if curl -s -o /dev/null -w '' "http://localhost:$port/health" 2>/dev/null; then
            echo "  $name is ready on port $port"
            return 0
        fi
        sleep 1
    done
    echo "  FAIL: $name did not start on port $port within ${max_attempts}s"
    return 1
}

# ── Build ──────────────────────────────────────────────────────────
echo "Building all packages..."
cd "$ROOT_DIR"
NODE_ENV=production pnpm run build 2>&1 || { echo "Build failed"; exit 1; }
echo ""

# ── Start servers ──────────────────────────────────────────────────
echo "Starting servers..."

(cd "$ROOT_DIR/apps/api" && NODE_ENV=production exec node .) &
PIDS+=($!)

(cd "$ROOT_DIR/apps/content" && NODE_ENV=production exec node .) &
PIDS+=($!)

(cd "$ROOT_DIR/apps/shell" && NODE_ENV=production exec node .) &
PIDS+=($!)

echo "Waiting for servers to be ready..."
wait_for_server $API_PORT "API"
wait_for_server $CONTENT_PORT "Content"
wait_for_server $SHELL_PORT "Shell"
echo ""

# ── Health checks ──────────────────────────────────────────────────
echo "Health checks:"
for app in "Shell:$SHELL_PORT" "Content:$CONTENT_PORT" "API:$API_PORT"; do
    name="${app%%:*}"
    port="${app##*:}"
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/health")
    assert "$name /health returns 200" "$status" "200"
done
echo ""

# ── API endpoints ─────────────────────────────────────────────────
echo "API endpoints:"
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$API_PORT/translation")
assert "GET /translation returns 200" "$status" "200"

body=$(curl -s "http://localhost:$API_PORT/translation")
assert_contains "/translation returns JSON with languages" "$body" '"en"'

status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$API_PORT/navigation")
assert "GET /navigation returns 200" "$status" "200"
echo ""

# ── Shell SSR ─────────────────────────────────────────────────────
echo "Shell SSR:"
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SHELL_PORT/")
assert "GET / returns 200" "$status" "200"

body=$(curl -s "http://localhost:$SHELL_PORT/")
assert_contains "SSR returns HTML" "$body" "<!DOCTYPE html>"
assert_contains "SSR includes CSP nonce" "$body" "nonce="
echo ""

# ── Security headers ─────────────────────────────────────────────
echo "Security headers:"
headers=$(curl -s -I "http://localhost:$SHELL_PORT/")
assert_contains "Shell sets Content-Security-Policy" "$headers" "Content-Security-Policy"
assert_contains "Shell sets X-Content-Type-Options" "$headers" "X-Content-Type-Options"

headers=$(curl -s -I "http://localhost:$SHELL_PORT/")
assert_contains "Shell returns correlation ID" "$headers" "x-correlation-id"
echo ""

# ── Content static assets ────────────────────────────────────────
echo "Content app CORP header:"
headers=$(curl -s -I "http://localhost:$CONTENT_PORT/client/" 2>/dev/null || echo "")
assert_contains "Content /client/ sets Cross-Origin-Resource-Policy" "$headers" "cross-origin"
echo ""

# ── 404 handling ──────────────────────────────────────────────────
echo "404 handling:"
status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SHELL_PORT/nonexistent-page")
assert "Shell returns 404 for unknown routes" "$status" "404"
echo ""

# ── Correlation ID propagation ────────────────────────────────────
echo "Correlation ID:"
custom_id="test-correlation-$(date +%s)"
returned_id=$(curl -s -I -H "x-correlation-id: $custom_id" "http://localhost:$SHELL_PORT/" | grep -i "x-correlation-id" | tr -d '\r' | awk '{print $2}')
assert "Shell propagates incoming correlation ID" "$returned_id" "$custom_id"
echo ""

# ── Summary ───────────────────────────────────────────────────────
echo "════════════════════════════════════════"
echo "Results: $PASSED passed, $FAILED failed"
echo "════════════════════════════════════════"

if [[ $FAILED -gt 0 ]]; then
    exit 1
fi
