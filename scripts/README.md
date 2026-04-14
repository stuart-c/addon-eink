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
./scripts/run_dev.sh
```

### What it does:

1.  **Pulls the Image**: Fetches `ghcr.io/stuart-c/eink-layout-manager:dev` from the GitHub Container Registry.
2.  **Cleanup**: Automatically stops and removes any previously running `eink-layout-manager-dev` container.
3.  **Starts Container**:
    - **Port**: Maps host port `8099` to container port `8099`.
    - **Persistence**: Maps `./dev_data` in the project root to `/data` in the container. Any layouts or display types created will be saved here.
4.  **Browser**: Automatically attempts to open `http://localhost:8099` in your default browser.
5.  **Logs**: Starts following the container logs in your terminal. **Press `Ctrl+C` to stop the logs and shut down the container.**

## `run_tests.sh`

Runs all unit and integration tests for both backend (Python) and frontend (TypeScript). It also runs linters (`black`, `flake8`) and type checks (`tsc`).

## `run_e2e.sh`

Runs End-to-End tests using **Playwright**. This script builds the frontend and starts the backend to verify the full user flow.
