#!/bin/bash

# Port Verification Script
# Verifies that applications run on the correct ports in each mode.
#
# Expected ports:
#   Development: Shell=3030, Content=3031, API=3032
#   Production:  Shell=3000, Content=3001, API=3002

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

cleanup() {
    echo -e "\n${YELLOW}Cleaning up processes...${NC}"

    # Kill by process patterns
    pkill -f "rspack" 2>/dev/null || true
    pkill -f "nodemon" 2>/dev/null || true

    # Kill processes on all possible ports
    for port in 3000 3001 3002 3030 3031 3032; do
        pid=$(lsof -ti :$port 2>/dev/null || true)
        if [ -n "$pid" ]; then
            kill $pid 2>/dev/null || true
        fi
    done

    sleep 3

    # Verify ports are clear
    local ports_clear=true
    for port in 3000 3001 3002 3030 3031 3032; do
        if lsof -ti :$port > /dev/null 2>&1; then
            echo -e "  ${YELLOW}Warning: Port $port still occupied, force killing...${NC}"
            kill -9 $(lsof -ti :$port) 2>/dev/null || true
            ports_clear=false
        fi
    done

    if [ "$ports_clear" = false ]; then
        sleep 2
    fi
}

check_port() {
    local port=$1
    local expected=$2
    local app=$3

    if curl -s --max-time 2 "http://localhost:$port" > /dev/null 2>&1; then
        if [ "$expected" = "yes" ]; then
            echo -e "  ${GREEN}✓${NC} $app on port $port"
            return 0
        else
            echo -e "  ${RED}✗${NC} $app unexpectedly running on port $port"
            return 1
        fi
    else
        if [ "$expected" = "no" ]; then
            echo -e "  ${GREEN}✓${NC} $app not on port $port (correct)"
            return 0
        else
            echo -e "  ${RED}✗${NC} $app not running on port $port (expected)"
            return 1
        fi
    fi
}

wait_for_servers() {
    local max_wait=$1
    local check_port=$2
    local waited=0

    while [ $waited -lt $max_wait ]; do
        if curl -s --max-time 1 "http://localhost:$check_port" > /dev/null 2>&1; then
            return 0
        fi
        sleep 1
        waited=$((waited + 1))
    done
    return 1
}

trap cleanup EXIT

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}    Port Configuration Verification     ${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Ensure clean state
cleanup

ERRORS=0

# Test 1: Production Mode
echo -e "${YELLOW}Test 1: Production Mode (pnpm run build + pnpm run serve)${NC}"
echo "Building for production..."
pnpm run build > /dev/null 2>&1

echo "Starting production servers..."
pnpm run serve > /dev/null 2>&1 &
sleep 5

if ! wait_for_servers 10 3000; then
    echo -e "${RED}Servers did not start in time${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo "Checking production ports..."
    check_port 3000 "yes" "Shell" || ERRORS=$((ERRORS + 1))
    check_port 3001 "yes" "Content" || ERRORS=$((ERRORS + 1))
    check_port 3002 "yes" "API" || ERRORS=$((ERRORS + 1))
    check_port 3030 "no" "Shell (dev)" || ERRORS=$((ERRORS + 1))
    check_port 3031 "no" "Content (dev)" || ERRORS=$((ERRORS + 1))
    check_port 3032 "no" "API (dev)" || ERRORS=$((ERRORS + 1))
fi

cleanup

# Test 2: Development Mode
echo ""
echo -e "${YELLOW}Test 2: Development Mode (pnpm run dev)${NC}"
echo "Starting development servers (this includes a build)..."
pnpm run dev > /dev/null 2>&1 &
sleep 15

if ! wait_for_servers 20 3030; then
    echo -e "${RED}Servers did not start in time${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo "Checking development ports..."
    check_port 3030 "yes" "Shell" || ERRORS=$((ERRORS + 1))
    check_port 3031 "yes" "Content" || ERRORS=$((ERRORS + 1))
    check_port 3032 "yes" "API" || ERRORS=$((ERRORS + 1))
    check_port 3000 "no" "Shell (prod)" || ERRORS=$((ERRORS + 1))
    check_port 3001 "no" "Content (prod)" || ERRORS=$((ERRORS + 1))
    check_port 3002 "no" "API (prod)" || ERRORS=$((ERRORS + 1))
fi

echo ""
echo -e "${YELLOW}========================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}All port checks passed!${NC}"
    exit 0
else
    echo -e "${RED}$ERRORS port check(s) failed${NC}"
    exit 1
fi
