# Agent Workflow Guide

This document defines the mandatory workflow for all AI agents working on the `addon-eink` repository. Following these rules ensures consistency, prevents conflicts, and maintains high code quality.

## 0. Language Standard
All documentation, UI labels, and internal code (where standards allow) **MUST** use **British English**.
- Use `colour` instead of `color`.
- Use `-ise` suffixes instead of `-ize` (e.g., `initialise`, `standardise`, `optimise`).
- Use `greyscale` instead of `grayscale`.
- Use `centre` instead of `center` (except in CSS properties).

## 1. Documentation First
Before making any changes, agents **MUST** read all documentation in the root and the `agent_docs/` directory. This includes:
- `README.md`
- `agents.md` (this file)
- `agent_docs/01_ARCHITECTURE.md`
- `agent_docs/03_DEVELOPMENT.md`

## 2. Branch Naming
All branches must be named according to [Conventional Commits](https://www.conventionalcommits.org/):
- `feat/`: New features
- `fix/`: Bug fixes
- `docs/`: Documentation changes
- `style/`: Formatting, missing semi colons, etc; no code change
- `refactor/`: Refactoring production code
- `test/`: Adding missing tests, refactoring tests; no production code change
- `chore/`: Updating build tasks, package manager configs, etc; no production code change

Example: `feat/add-layout-scaling` or `fix/broken-sidebar-link`.

## 3. Git Worktrees for Parallel Work
It is vitally important that git worktrees are used to allow multiple agents to work in parallel without overlap.
- **The main directory must only ever contain the `main` branch.**
- **All feature branch worktrees MUST reside in the `.worktrees/` directory.**
- Never checkout a feature branch in the core repository directory.
- Use `git worktree add .worktrees/<branch-name> <branch-name>` to create a new workspace for your task.

## 4. Pre-Push Verification
Tests and lints **MUST** be run locally using the root `venv` before being pushed to GitHub. This is mandatory whenever Python code is modified.
- **Formatting:** `./venv/bin/black --check --line-length 79 eink_layout_manager/app` (must match Dockerfile parameters).
- **Linting:** `./venv/bin/flake8 --exclude=venv eink_layout_manager/app`.
- **Tests:** `PYTHONPATH=eink_layout_manager ./venv/bin/pytest eink_layout_manager/app/tests`.

> [!NOTE]
> If the local Node.js version is incompatible with the frontend requirements (>=22.13.0), you are exempt from running `npm test` locally. In this case, you must only run the checks that work and rely on the PR build status for frontend verification.

## 5. Pull Request Management
- **Mergeability:** PRs **MUST** be rebased from the latest `main` branch before any review is requested.
  ```bash
  git fetch origin
  git rebase origin/main
  ```
- **Local Verification:** You **MUST** ensure all tests and lints pass locally (as per Section 4) before requesting a review. For frontend changes where local Node.js is incompatible, the GitHub Action build status is the primary source of truth.
- **PR Quality:** Before requesting a review, you **MUST** update the PR title and description to provide a clear explanation of:
    - **Purpose:** Why are these changes being made?
    - **Implementation:** How were the changes implemented? Highlight any significant architectural decisions, complex logic, or new patterns.
- **Builds:** Ensure all GitHub Action builds for the PR are passing before requesting review.
- **Auto-Merge:** You **MUST** enable auto-merge when creating a pull request. This is a mandatory step to keep the development cycle efficient.
  ```bash
  gh pr create --fill --auto
  ```
- **Auto-Merge Verification:** If for any reason auto-merge is not enabled during creation, it must be enabled immediately after:
  ```bash
  gh pr merge --auto --merge
  ```

## 6. Post-Merge Cleanup
When a PR is merged, the local environment must be tidied:
1. Remove the worktree: `git worktree remove .worktrees/<branch-name>`
2. Delete the local branch: `git branch -d <branch-name>`
3. Update the local `main` branch: `git checkout main && git pull origin main`
