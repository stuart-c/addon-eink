#!/bin/bash
set -e

TOP_DIR=$( git rev-parse --show-toplevel )
CONVERTER_DIR="$TOP_DIR/eink_layout_manager/converter"

echo "--- Building Epdoptimize ---"
cd "$TOP_DIR/eink_layout_manager/epdoptimize"
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
npm install --no-audit
npm run build

echo "--- Installing Converter Dependencies ---"
cd "$CONVERTER_DIR"
# Use local cache directory to avoid permission issues in sandboxed environments
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
npm install --no-audit

echo "--- Running Converter Tests ---"
npm test -- --run
