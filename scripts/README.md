# Development Scripts

This directory contains scripts to streamline the development and testing of the eInk Layout Manager.

## `run_dev.sh`

This script pulls the latest multi-arch development Docker image and starts a container for local testing.

### Prerequisites

- **Docker**: Must be installed and running.
- **Bash**: Required to run the script.

### Usage

Run the script from the **project root directory**:

```bash
bash scripts/run_dev.sh
```

### What it does:

1.  **Pulls the Image**: Fetches `ghcr.io/stuart-c/eink-layout-manager:dev` from the GitHub Container Registry.
2.  **Cleanup**: Automatically stops and removes any previously running `eink-layout-manager-dev` container.
3.  **Starts Container**:
    - **Port**: Maps host port `8099` to container port `8099`.
    - **Persistence**: Maps `./dev_data` in the project root to `/data` in the container. Any layouts or display types created will be saved here.
4.  **Browser**: Automatically attempts to open `http://localhost:8099` in your default browser.
5.  **Logs**: Starts following the container logs in your terminal. You can safely press `Ctrl+C` to stop viewing the logs without stopping the container.

### Stopping the container

If you want to stop the container after use:

```bash
docker stop eink-layout-manager-dev
```
