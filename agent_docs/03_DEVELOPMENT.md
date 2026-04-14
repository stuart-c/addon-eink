# Development Guidelines

This document outlines the standard development process and recent design decisions for the `addon-eink` repository. Following these guidelines ensures consistency across multiple agents and contributors. 

> [!IMPORTANT]
> This repository strictly uses **British English** for all documentation, UI labels, and internal code (where it does not conflict with external standards). Agents must use `colour`, `initialise`, `centre`, and `greyscale`.

## Local Development Environment

### VS Code Dev Containers
We utilise **VS Code Dev Containers** to provide a consistent, reproducible development environment.

- **Base Image:** `Python 3.12-bookworm` (Debian-based).
- **Tooling:** The container is pre-configured with `black`, `flake8`, and `pytest`.
- **Usage:** Open the repository in VS Code and select "Reopen in Container" when prompted.

> [!TIP]
> Using the dev container ensures you are running tests and linters in the exact same environment as the CI pipeline.

## Frontend Development

The frontend UI is located in `eink_layout_manager/app/static`.

- **Node.js Requirement:** The frontend requires **Node.js >=24.14.1**.
- **Local Environment Note:** The local development environment may have an older version of Node.js (e.g., v18.x). In such cases, full test suites (`npm test`) may fail locally.
- **Testing Strategy:** When local Node.js is incompatible, agents should only run checks that are known to work (e.g., basic linting or type checking if possible) and **MUST** rely on the GitHub Actions PR build status to verify frontend correctness.

## Workflow Patterns

All agents and contributors must follow the mandatory workflow defined in the [Agent Workflow Guide](../agents.md). This includes using the `.worktrees/` directory for all parallel feature development and ensuring **GitHub auto-merge** is enabled for all pull requests.

> [!IMPORTANT]
> **Enabling auto-merge is mandatory.** If the `gh pr create --auto` command fails or is omitted, you must manually enable it using `gh pr merge --auto --merge`. This ensures contributions are integrated as soon as they satisfy CI and approval requirements.

### Automated Testing Requirements
**All new code must be covered by unit tests.** 
- Ensure that any new logic, API endpoints, or schema changes have corresponding test cases in the `tests/` directory.
- **Mandatory Verification**: You **MUST** verify that your tests and lints pass locally using the root `venv` before submitting a PR or requesting a review, as per the parameters in the [Workflow Guide](../agents.md).

### API Consistency Rule
To simplify frontend state management, **POST (creation) responses MUST exactly match GET (retrieval) responses** for the same resource. This ensures the frontend receives the complete metadata object immediately upon resource creation.

## Recent Design Decisions

### Image Processing Pipeline
- **Duplicate Prevention:** We use SHA-256 file hashing to uniquely identify image assets. Attempting to upload a duplicate image results in a `409 Conflict` response containing the existing image's metadata.
- **Thumbnail Generation:** Thumbnails are automatically generated on upload (max 200x200px) and stored in a dedicated `/data/thumbnail` directory.
- **Thumbnail Retrieval:** A dedicated endpoint `GET /api/image/{id}/thumbnail` is used to serve the binary thumbnail data.

### Hardware Support
- **Spectra 6 (BWGBRY) support:** The `colour_type` schema has been updated to include `BWGBRY` to support OpenDisplay's Spectra 6 hardware.
- **Asymmetrical Mat Thickness:** The `mat` schema now supports flexible dimensions. You can specify symmetrical thickness via `thickness_mm` or asymmetrical dimensions using `horizontal_mm` and `vertical_mm`.

### Infrastructure
- **Debian-based Dev Container:** We chose `bookworm` (Debian) for the dev environment to provide better compatibility with debugging tools and VS Code extensions compared to Alpine, while maintaining a mirrored Python version (3.12) with the production environment.

## Workflow Infrastructure

### GitHub Actions Pinning
To ensure security and build reproducibility, all GitHub Actions used in this repository **MUST** be pinned to an immutable commit SHA.
- Always include the human-readable version as a comment (e.g., `uses: actions/checkout@de0fac2e450... # v6.0.2`).
- Pinning prevents supply chain attacks and ensures that workflows do not break unexpectedly due to tag mutability.

### Workflow File Naming
All GitHub workflow files must use the `.yaml` extension (standard YAML) rather than `.yml`. They are located in `.github/workflows/`.
- Example: `build.yaml`, `lint.yaml`.
