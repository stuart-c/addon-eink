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

## `run_tests.sh` (Mandatory)

This script runs the full local test suite (Python lints, Python unit tests, and Frontend unit tests). **Running this script is mandatory before submitting any code changes.**

### Usage

```bash
./scripts/run_tests.sh
```

### Auto-provisioning

If the Python virtual environment (`.venv`) is not found, the script will automatically run `./scripts/make_venv.sh` to provision it for you.

## `run_e2e.sh` (Mandatory)

This script runs the end-to-end integration tests using Playwright. **Running this script is mandatory for changes affecting the core application logic or API.**

### Usage

```bash
./scripts/run_e2e.sh
```

### Auto-provisioning

Like `run_tests.sh`, this script will automatically provision the virtual environment and ensure Playwright browsers are installed if they are missing.

## `make_venv.sh`

A helper script used by the testing tools to create a Python virtual environment and initialise `nodeenv` with the correct Node.js version.

### Usage

```bash
./scripts/make_venv.sh
```

## `build_frontend.sh`

This script builds the frontend assets.

### Usage

```bash
./scripts/build_frontend.sh
```

### Auto-provisioning

If the Python virtual environment is not found, it will automatically run `./scripts/make_venv.sh`.

## `run_app.sh`

This script runs the backend application locally within the virtual environment.

### Usage

```bash
./scripts/run_app.sh
```

### Auto-provisioning

If the Python virtual environment is not found, it will automatically run `./scripts/make_venv.sh`.


