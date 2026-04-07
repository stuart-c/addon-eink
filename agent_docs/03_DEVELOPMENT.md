# Development Guidelines

This document outlines the standard development process and recent design decisions for the `addon-eink` repository. Following these guidelines ensures consistency across multiple agents and contributors.

## Local Development Environment

### VS Code Dev Containers
We utilize **VS Code Dev Containers** to provide a consistent, reproducible development environment.

- **Base Image:** `Python 3.12-bookworm` (Debian-based).
- **Tooling:** The container is pre-configured with `black`, `flake8`, and `pytest`.
- **Usage:** Open the repository in VS Code and select "Reopen in Container" when prompted.

> [!TIP]
> Using the dev container ensures you are running tests and linters in the exact same environment as the CI pipeline.

## Workflow Patterns

### 1. Branch Isolation with Git Worktrees
To avoid environment pollution and facilitate parallel work across different tracks, always use **git worktrees** when working on multiple branches.

```bash
git worktree add .worktrees/feature-name -b feature/name
```

### 2. Pre-PR Verification
Before pushing changes or creating a Pull Request, you **MUST** run the following quality checks locally within the dev container:

- **Linting:** `flake8 .`
- **Formatting:** `black .`
- **Testing:** `pytest`

### 3. Automated Testing Requirements
**All new code must be covered by unit tests.** 
- Ensure that any new logic, API endpoints, or schema changes have corresponding test cases in the `tests/` directory.
- Verify that your tests pass locally before submitting a PR.

### 4. PR Management and Monitoring
When a PR is created:
1. **Monitor CI Checks:** Use `gh pr checks <pr-number> --watch` to monitor the GitHub Actions status.
2. **Mandatory Passing Builds:** Never merge or request a final review until all CI builds (including linting and build tests) are passing.

## Recent Design Decisions

### Hardware Support
- **Spectra 6 (BWGBRY) support:** The `colour_type` schema has been updated to include `BWGBRY` to support OpenDisplay's Spectra 6 hardware.
- **Asymmetrical Mat Thickness:** The `mat` schema now supports flexible dimensions. You can specify symmetrical thickness via `thickness_mm` or asymmetrical dimensions using `horizontal_mm` and `vertical_mm`.

### Infrastructure
- **Debian-based Dev Container:** We chose `bookworm` (Debian) for the dev environment to provide better compatibility with debugging tools and VS Code extensions compared to Alpine, while maintaining a mirrored Python version (3.12) with the production environment.
