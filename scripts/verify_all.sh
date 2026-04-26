#!/bin/bash
set -e

# Get the absolute path to the repository root
TOP_DIR=$( git rev-parse --show-toplevel )

# Generate a random free port
# Using Python for a cross-platform reliable way to find a free port
GENERATED_PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()')
export INGRESS_PORT="${INGRESS_PORT:-$GENERATED_PORT}"

# Create a temporary data directory in the project root
TEMP_DATA_DIR=$(mktemp -d -p "$TOP_DIR" .data_verify_XXXXXX)
export DATA_DIR="$TEMP_DATA_DIR"
export MEDIA_DIR="$TEMP_DATA_DIR/media"

echo "--- 🛠️  Setup: Using Port $INGRESS_PORT and Data Dir $DATA_DIR ---"

# Cleanup function to be called on script exit or interruption
cleanup() {
    local exit_code=$?
    echo ""
    if [ ! -z "$APP_PID" ]; then
        echo "--- 🛑 Stopping background application (PID: $APP_PID) ---"
        kill "$APP_PID" 2>/dev/null || true
        # Wait a moment for the process to exit
        sleep 1
    fi
    
    if [ -d "$TEMP_DATA_DIR" ]; then
        echo "--- 🧹 Cleaning up temporary data directory ---"
        rm -rf "$TEMP_DATA_DIR"
    fi
    
    if [ $exit_code -ne 0 ] && [ $exit_code -ne 130 ]; then
        echo "❌ Verification FAILED"
    elif [ $exit_code -eq 0 ]; then
        echo "✅ Verification SUCCESSFUL"
    fi
    exit $exit_code
}

# Trap signals for cleanup
trap cleanup EXIT INT TERM

echo "--- 1/4 🏗️  Building Frontend ---"
"$TOP_DIR/scripts/build_frontend.sh"

echo "--- 2/4 🧪 Running Unit Tests and Lints ---"
"$TOP_DIR/scripts/run_tests.sh"

echo "--- 3/4 🚀 Starting Backend Application in Background ---"
"$TOP_DIR/scripts/run_app.sh" &
APP_PID=$!

# Wait for app to be ready via health check
echo "--- ⏳ Waiting for application to be ready on port $INGRESS_PORT ---"
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s "http://localhost:$INGRESS_PORT/api/ping" | grep -q "pong"; then
        echo "--- 🟢 Application is ready! ---"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "❌ Error: Application failed to start on port $INGRESS_PORT within 30 seconds."
        exit 1
    fi
    sleep 1
done

echo "--- 4/4 🎭 Running End-to-End Tests ---"
# Set BASE_URL to the dynamic port for Playwright
export BASE_URL="http://127.0.0.1:$INGRESS_PORT"
"$TOP_DIR/scripts/run_e2e.sh"
