#!/bin/bash
set -e

# Get the absolute path to the repository root
TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink/backend/.venv"

# check if venv exists
if [ ! -d "$VENV_PATH" ]; then
    echo "--- Virtual environment not found. Building... ---"
    "$TOP_DIR/scripts/make_venv.sh"
fi

# Activate the virtual environment
source "$VENV_PATH/bin/activate"

echo "--- Installing Python Dependencies ---"
pip install -q -r "$TOP_DIR/eink/backend/requirements.txt"

# Run Node.js E2E tests if they exist
if [ -d "$TOP_DIR/eink/e2e" ]; then
    echo "--- Running Node.js E2E Tests ---"
    cd "$TOP_DIR/eink/e2e"
    # Wipe test data to ensure a clean state
    rm -rf test_data_e2e
    # Use local cache directory to avoid permission issues in sandboxed environments
    export NPM_CONFIG_CACHE="$PWD/.npm-cache"
    npm install --no-audit
    npm test -- "$@"
fi

# Run Python E2E tests if they exist
if [ -d "$TOP_DIR/eink/e2e_python" ]; then
    echo "--- Running Python E2E Tests ---"
    cd "$TOP_DIR"
    export PYTHONPATH=$TOP_DIR
    pytest eink/e2e_python
fi
