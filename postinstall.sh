#!/bin/bash

# Path to the .githooks directory
GITHOOKS_DIR=".githooks"

# Check if the .githooks directory exists
if [ ! -d "$GITHOOKS_DIR" ]; then
    echo "Error: .githooks directory not found."
    exit 1
fi

# Update .git/config to use .githooks directory as hooks directory
git config core.hooksPath "$GITHOOKS_DIR"
git config --global color.ui auto  

echo "Git hooks configured to use .githooks directory."