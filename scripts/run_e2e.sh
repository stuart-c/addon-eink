#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/app/.venv"

if [ ! -d "$VENV_PATH" ]; then
    echo "Error: Virtual environment not found at $VENV_PATH"
    echo "Please run ./scripts/make_venv.sh first."
    exit 1
fi

source "$VENV_PATH/bin/activate"

echo "--- Installing Python Dependencies ---"
cd "$TOP_DIR/eink_layout_manager/app"
pip install -q -r requirements.txt -r requirements_test.txt -r requirements_e2e.txt

echo "--- Installing Frontend Dependencies & Building ---"
cd "$TOP_DIR/eink_layout_manager/app/static"
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
npm install --no-audit
npm run build

echo "--- Starting Application in Background ---"
cd "$TOP_DIR/eink_layout_manager/app"
export DATA_DIR="/tmp/eink-data-e2e"
mkdir -p "$DATA_DIR"
export INGRESS_PORT=8123
export PYTHONPATH="$TOP_DIR/eink_layout_manager"
python3 main.py > "$TOP_DIR/app.log" 2>&1 &
APP_PID=$!

# Function to cleanup app on exit
cleanup() {
    echo "--- Stopping Application (PID $APP_PID) ---"
    kill $APP_PID || true
}
trap cleanup EXIT

echo "--- Waiting for Application to be Ready ---"
timeout 30 bash -c 'until curl -s http://localhost:8123 > /dev/null; do sleep 1; done'

echo "--- Running Python E2E Tests ---"
cd "$TOP_DIR"
PYTHONPATH="$TOP_DIR/eink_layout_manager" pytest eink_layout_manager/e2e_python

echo "--- Running Node.js E2E Tests (Playwright) ---"
cd "$TOP_DIR/eink_layout_manager/e2e"
npm install --no-audit
npx playwright install chromium
# Run Node.js tests pointing to our app
BASE_URL="http://localhost:8123" npx playwright test
