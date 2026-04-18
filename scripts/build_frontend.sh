#!/bin/bash
set -e

# Get the absolute path to the repository root
TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/backend/.venv"

# Check if venv exists, if not build it
if [ ! -d "$VENV_PATH" ]; then
    echo "--- Virtual environment not found. Building... ---"
    "$TOP_DIR/scripts/make_venv.sh"
fi

# Activate the virtual environment
source "$VENV_PATH/bin/activate"

echo "--- Installing Frontend Dependencies ---"
cd "$TOP_DIR/eink_layout_manager/frontend"
# Use local cache directory to avoid permission issues in sandboxed environments
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
npm install --no-audit

echo "--- Building Frontend Assets ---"
npm run build

echo "Done. Frontend assets built in eink_layout_manager/frontend/dist"
