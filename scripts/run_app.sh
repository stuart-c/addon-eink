#!/bin/bash
set -e

# Get the absolute path to the repository root
TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink/backend/.venv"

# Check if venv exists, if not build it
if [ ! -d "$VENV_PATH" ]; then
    echo "--- Virtual environment not found. Building... ---"
    "$TOP_DIR/scripts/make_venv.sh"
fi

# Activate the virtual environment
source "$VENV_PATH/bin/activate"

echo "--- Installing Python Dependencies ---"
cd "$TOP_DIR/eink/backend"
pip install -q -r requirements.txt

echo "--- Running Application ---"
# Set PYTHONPATH so 'import backend' works from the root of the backend directory
export PYTHONPATH="$TOP_DIR/eink"
# Set defaults if not provided
export DATA_DIR="${DATA_DIR:-$TOP_DIR/.data}"
export MEDIA_DIR="${MEDIA_DIR:-$TOP_DIR/.media}"
export INGRESS_PORT="${INGRESS_PORT:-8099}"
export LOG_LEVEL="${LOG_LEVEL:-info}"
export PYTHONUNBUFFERED=1

mkdir -p "$DATA_DIR" "$MEDIA_DIR"
python3 -m backend.main
