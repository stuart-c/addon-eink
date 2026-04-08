#!/bin/bash

# Configuration
IMAGE="ghcr.io/stuart-c/eink-layout-manager:dev"
CONTAINER_NAME="eink-layout-manager-dev"
PORT=8099
DATA_DIR="$(pwd)/dev_data"

# Ensure we are in the project root (simple check for eink_layout_manager dir)
if [ ! -d "eink_layout_manager" ]; then
    echo "Error: Please run this script from the project root directory."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🚀 Pulling latest dev image: $IMAGE"
docker pull $IMAGE

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Warning: Port $PORT is already in use. The container might fail to start if it's not the existing eink-layout-manager-dev."
fi

echo "🧹 Cleaning up existing container: $CONTAINER_NAME"
docker rm -f $CONTAINER_NAME 2>/dev/null

echo "📦 Starting container: $CONTAINER_NAME"
# Ensure data directory exists
mkdir -p "$DATA_DIR"

docker run -d \
  --name "$CONTAINER_NAME" \
  -p $PORT:8099 \
  -v "$DATA_DIR:/data" \
  $IMAGE

echo "🌐 Opening browser at http://localhost:$PORT"
# Wait a brief moment for the container to start serving
sleep 2

if command -v xdg-open > /dev/null; then
  xdg-open "http://localhost:$PORT"
elif command -v open > /dev/null; then
  open "http://localhost:$PORT"
else
  echo "ℹ️ Could not detect browser opener (xdg-open/open). Please navigate to http://localhost:$PORT manually."
fi

echo "📑 Following logs (Ctrl+C to stop, container will keep running in background)"
docker logs -f $CONTAINER_NAME
