#!/bin/bash
set -e

# Get the root of the repository even if run from a worktree
REPO_ROOT=$(git rev-parse --show-toplevel)
SSH_DIR="$REPO_ROOT/.ssh_internal"
IMAGE_NAME="addon-eink-ssh"
CONTAINER_NAME="addon-eink-standalone"

# 1. Key Generation
if [ ! -f "$SSH_DIR/id_rsa" ]; then
    echo "Generating new SSH key pair in $SSH_DIR..."
    mkdir -p "$SSH_DIR"
    ssh-keygen -t rsa -b 4096 -f "$SSH_DIR/id_rsa" -N "" -q
    chmod 600 "$SSH_DIR/id_rsa"
    chmod 644 "$SSH_DIR/id_rsa.pub"
fi

# 2. Build
echo "Building Docker image $IMAGE_NAME..."
docker build -t "$IMAGE_NAME" -f "$REPO_ROOT/.devcontainer/Dockerfile" "$REPO_ROOT"

# 3. Stop existing
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container $CONTAINER_NAME..."
    docker rm -f "$CONTAINER_NAME"
fi

# 4. Run
echo "Starting container $CONTAINER_NAME on localhost:2222..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p 2222:22 \
    -v "$REPO_ROOT:/workspaces/addon-eink" \
    -v "$SSH_DIR/id_rsa.pub:/home/vscode/.ssh/authorized_keys:ro" \
    "$IMAGE_NAME"

echo "Container is up. You can connect using ./scripts/ssh_connect.sh"
