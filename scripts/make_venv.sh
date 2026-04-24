#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/backend/.venv"

echo "--- Creating Python Virtual Environment ---"
if [ ! -d "$VENV_PATH" ]; then
    python3 -m venv "$VENV_PATH"
fi

source "$VENV_PATH/bin/activate"

echo "--- Installing Nodeenv ---"
pip install -q nodeenv

echo "--- Initialising Nodeenv (Node 24.15.0) ---"
if [ ! -f "$VENV_PATH/bin/node" ]; then
    nodeenv -p --node=24.15.0
else
    echo "Nodeenv already initialised."
fi

echo "--- Installing Playwright (Python) ---"
pip install -q playwright pytest-playwright requests

echo "--- Installing Playwright Browsers (Python) ---"
playwright install chromium

if [ -d "$TOP_DIR/eink_layout_manager/e2e" ]; then
    echo "--- Provisioning Node.js Playwright ---"
    cd "$TOP_DIR/eink_layout_manager/e2e"
    # Use local cache directory to avoid permission issues
    export NPM_CONFIG_CACHE="$TOP_DIR/eink_layout_manager/e2e/.npm-cache"
    npm install --no-audit
    npx playwright install chromium
    cd "$TOP_DIR"
fi

echo "Done. You can now run ./scripts/run_tests.sh or ./scripts/run_e2e.sh"
