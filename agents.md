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
- **All feature branch worktrees MUST reside in the `.worktrees/` directory.**
- Never checkout a feature branch in the core repository directory.
- Use `git worktree add .worktrees/<branch-name> <branch-name>` to create a new workspace for your task.

## 4. Pre-Push Verification
Tests and lints **MUST** be run locally before being pushed to GitHub.
- **Linting:** `flake8 .`
- **Formatting:** `black .`
- **Tests:** `pytest`

## 5. Pull Request Management
- **Mergeability:** PRs must be checked for mergeability before review. If `main` has moved forward, rebase your branch:
  ```bash
  git fetch origin
  git rebase origin/main
  ```
- **Builds:** Ensure all GitHub Action builds for the PR are passing before requesting review.

## 6. Post-Merge Cleanup
When a PR is merged, the local environment must be tidied:
1. Remove the worktree: `git worktree remove .worktrees/<branch-name>`
2. Delete the local branch: `git branch -d <branch-name>`
3. Update the local `main` branch: `git checkout main && git pull origin main`
