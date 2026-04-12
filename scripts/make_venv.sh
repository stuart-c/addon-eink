#!/bin/bash

TOP_DIR=$( git rev-parse --show-toplevel )

virtualenv $TOP_DIR/eink_layout_manager/app/.venv
source $TOP_DIR/eink_layout_manager/app/.venv/bin/activate
pip install nodeenv
nodeenv -p --node=22.22.2
