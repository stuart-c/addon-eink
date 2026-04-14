#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )

python3 -m venv $TOP_DIR/eink_layout_manager/app/.venv
source $TOP_DIR/eink_layout_manager/app/.venv/bin/activate
pip install nodeenv
nodeenv -p --node=24.14.1
