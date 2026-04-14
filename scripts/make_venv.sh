#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/app/.venv"

echo "--- Creating Python Virtual Environment ---"
if [ ! -d "$VENV_PATH" ]; then
    python3 -m venv "$VENV_PATH"
fi

source "$VENV_PATH/bin/activate"

echo "--- Installing Nodeenv ---"
pip install -q nodeenv

echo "--- Initialising Nodeenv (Node 24.14.1) ---"
if [ ! -f "$VENV_PATH/bin/node" ]; then
    nodeenv -p --node=24.14.1
else
    echo "Nodeenv already initialised."
fi

echo "--- Installing Playwright (Python) ---"
pip install -q playwright pytest-playwright requests

echo "--- Installing Playwright Browsers ---"
playwright install chromium

echo "Done. You can now run ./scripts/run_tests.sh or ./scripts/run_e2e.sh"
