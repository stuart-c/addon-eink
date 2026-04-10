#!/bin/bash
REPO_ROOT=$(git rev-parse --show-toplevel)
ssh -i "$REPO_ROOT/.ssh_internal/id_rsa" \
    -p 2222 \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    vscode@localhost "$@"
