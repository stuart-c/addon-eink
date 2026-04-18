#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/backend/.venv"

if [ ! -d "$VENV_PATH" ]; then
    echo "--- Virtual environment not found. Building... ---"
    "$TOP_DIR/scripts/make_venv.sh"
fi

source "$VENV_PATH/bin/activate"

echo "--- Installing Python Dependencies ---"
cd "$TOP_DIR/eink_layout_manager/backend"
pip install -q -r requirements.txt -r requirements_test.txt

echo "--- Running Python Lints (Black & Flake8) ---"
black .
flake8 .

echo "--- Running Backend Tests (Pytest) ---"
pytest tests/

echo "--- Installing Frontend Dependencies ---"
cd "$TOP_DIR/eink_layout_manager/frontend"
# Use local cache directory to avoid permission issues in sandboxed environments
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
npm install --no-audit

echo "--- Running Frontend Type Checks (TSC) ---"
npx tsc --noEmit

echo "--- Running Frontend Tests (Vitest) ---"
npm test -- --run
