# eInk Layout Manager

A Home Assistant Addon for managing complex layouts across multiple eInk displays using the OpenDisplay integration.

## Installation

This addon is distributed via the [stuart-c/ha-addons](https://github.com/stuart-c/ha-addons) repository.

You can add the repository to your Home Assistant instance using the button below:

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fstuart-c%2Fha-addons)

Alternatively, add it manually:
1. Navigate in your Home Assistant frontend to **Settings** -> **Add-ons** -> **Add-on store**.
2. Click the three vertical dots (&#8942;) in the upper right corner and select **Repositories**.
3. Add `https://github.com/stuart-c/ha-addons` and click **Add**.
4. The add-on will now be available for configuration and installation.

For developers, you can clone the repository and manage issues/PRs using the GitHub CLI (`gh`):
```bash
gh repo clone stuart-c/addon-eink
```

## Development

The recommended way to develop for this repository is using **VS Code Dev Containers**. This ensures a consistent environment with all dependencies and tools pre-configured.

1. Open the repository in VS Code.
2. Click **"Reopen in Container"** when prompted.

For detailed development processes, architectural overview, and mandatory agent workflows, see:
- [Agent Workflow Guide](agents.md)
- [Agent Documentation Index](agent_docs/00_INDEX.md)
### Test Isolation

> [!WARNING]
> Running multiple instances of the application or its test suites concurrently on the same machine can cause port conflicts and data corruption. By default, the application and E2E tests target port `8099` and a shared `.data` directory.
> 
> To ensure isolation and prevent system overload, it is recommended to use `./scripts/verify_all.sh` or consult the [E2E Testing Guide](agent_docs/04_E2E_TESTS.md#parallel-test-isolation) for instructions on using custom ports and data directories.

### Running and Testing

Local testing is mandatory for all contributions. We provide several scripts in the `scripts/` directory to facilitate development and verification:

- **`./scripts/run_tests.sh`**: Runs Python lints, unit tests, and frontend tests.
- **`./scripts/run_e2e.sh`**: Runs end-to-end integration tests using Playwright.
- **`./scripts/verify_all.sh`**: Runs the full verification pipeline (build, unit tests, and E2E tests) in an isolated environment.
- **`./scripts/run_app.sh`**: Runs the backend application locally in a virtual environment.
- **`./scripts/run_dev.sh`**: Pulls the latest development Docker image and runs the full addon environment.

These scripts will automatically provision their own environments if necessary. For more details on available scripts and data persistence, see [scripts/README.md](scripts/README.md).
