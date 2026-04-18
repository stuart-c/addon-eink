# End-to-End (E2E) Testing

All end-to-end testing in the `addon-eink` repository is performed using **Playwright**. These tests ensure that both the backend APIs and the frontend UI function correctly in an integrated environment.

## Test Structure

The E2E tests are located in `eink_layout_manager/e2e/tests`. They are categorised into two main types:

### 1. API Verification Tests
Files prefixed with `api.` (e.g., `api.display_type.spec.ts`) focus on validating the backend REST API. These tests bypass the frontend and interact directly with the API endpoints.

**Coverage includes:**
- Full CRUD (Create, Read, Update, Delete) lifecycles for all resources.
- Schema validation for request payloads.
- Referential integrity (e.g., preventing deletion of a `Layout` referenced by a `Scene`).
- Server-side validation (e.g., duplicate detection, read-only field protection).
- Consistency checks (ensuring `POST` responses match subsequent `GET` requests).

### 2. Browser UI Tests
Standard specification files (e.g., `display_types.spec.ts`) focus on the frontend user experience. They use Playwright to automate a browser and interact with the Lit-based web interface.

**Coverage includes:**
- Fundamental user flows (e.g., creating a new display type via the UI).
- UI-specific logic (e.g., unsaved changes warnings and form validation).
- Visual feedback (e.g., success toasts and sidebar updates).
- Navigation and routing.

## Running Tests Locally

You can run the full E2E test suite using the provided script at the repository root:

```bash
./scripts/run_e2e.sh
```

This script handles:
1.  Initialising the virtual environment.
2.  Installing Playwright browsers if necessary.
3.  Starting a temporary backend instance.
4.  Executing the Playwright test suite.
5.  Cleaning up the temporary instance and data upon completion.

### Troubleshooting
- **Logs:** Test results and traces are stored in `eink_layout_manager/e2e/test-results`.
- **Environment:** If tests fail due to missing dependencies, ensure you have run `./scripts/make_venv.sh` first.
- **Port Conflicts:** If you see "Address already in use", ensure no orphan backend processes are running (see [Cleanup](#cleanup-orphaned-processes)).

## Parallel Test Isolation

When working in parallel (e.g., across multiple git worktrees), you must avoid resource contention.

### 1. Preferred Method: `verify_all.sh`
The `./scripts/verify_all.sh` script is the recommended way to run E2E tests in isolation. It automatically:
- Assigns a random available port.
- Creates a unique temporary data directory (`.data_verify_XXXXXX`).
- Cleans up all resources upon completion.

### 2. Manual Isolation with `run_e2e.sh`
If you need to run `run_e2e.sh` directly in an isolated way, you must override the default port and data directory:

```bash
# Example: Run on port 8100 with a custom data dir
export INGRESS_PORT=8100
export DATA_DIR=$(pwd)/my_test_data
./scripts/run_e2e.sh
```

## Load Management

E2E tests consume significant CPU and Memory. Before starting a new parallel test suite:
1.  **Check Load Average:** Run `uptime` or `top`.
2.  **Evaluate:** If the load average is significantly higher than your CPU core count, wait for existing tests to finish before starting more.
3.  **Monitor:** High load can lead to flaky tests due to timeouts.

## Cleanup Orphaned Processes

If a test run is aborted, the backend Python process might remain active.

### Find processes occupying a port:
```bash
lsof -i :8099
```

### Kill the process:
```bash
fuser -k 8099/tcp
```

## Guidelines for New Tests

When adding new features, you **MUST** ensure they are covered by both unit tests and E2E tests.

1.  **Prefer API tests for business logic:** If you are testing data validation or referential integrity, use an `api.*` test as it is faster and more robust.
2.  **Use UI tests for user flows:** Use browser tests to verify that UI components are correctly integrated with the backend and that the user journey is smooth.
3.  **Unique Data:** Use timestamps or UUIDs in test data (e.g., `e2e-dt-${Date.now()}`) to avoid state bleed between parallel test runs.
4.  **Clean up:** Although the `run_e2e.sh` script wipes the data directory, ensure individual tests clean up their own created resources where possible to maintain a clean environment for subsequent tests within the same run.
