#!/bin/bash
set -e

# Get the absolute path to the repository root
TOP_DIR=$( git rev-parse --show-toplevel )
VENV_PATH="$TOP_DIR/eink_layout_manager/app/.venv"

# Check if venv exists, if not build it
if [ ! -d "$VENV_PATH" ]; then
    echo "--- Virtual environment not found. Building... ---"
    "$TOP_DIR/scripts/make_venv.sh"
fi

# Activate the virtual environment
source "$VENV_PATH/bin/activate"

echo "--- Installing Python Dependencies ---"
cd "$TOP_DIR/eink_layout_manager/app"
pip install -q -r requirements.txt

echo "--- Running Application ---"
# Set PYTHONPATH so 'import app' works from the root of the app directory
export PYTHONPATH="$TOP_DIR/eink_layout_manager"
export DATA_DIR="$TOP_DIR/.data"
mkdir -p "$DATA_DIR"
python3 -m app.main
