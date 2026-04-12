#!/bin/bash

TOP_DIR=$( git rev-parse --show-toplevel )

source $TOP_DIR/eink_layout_manager/app/.venv/bin/activate

cd $TOP_DIR/eink_layout_manager/app

pip install -r requirements.txt -r requirements_test.txt
black .
flake8 .
pytest tests/

cd $TOP_DIR/eink_layout_manager/app/static

npm install && npx tsc --noEmit && npm test -- --run
