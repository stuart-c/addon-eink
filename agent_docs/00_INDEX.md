# Agent Documentation Index

This directory contains resources for AI agents to continue the development of the `addon-eink` repository. As new modules are introduced, please update the documentation within this directory to reflect the design decisions and instructions for parallel agent tasking.

- `01_ARCHITECTURE.md` - High-level overview of the application and its integration with Home Assistant.
- `02_OPEN_QUESTIONS.md` - Living document of design questions requiring clarification from the user.

## Agent Workflow Guidelines

1. **Review Constraints:** Always rely on this documentation when taking on new tasks.
2. **Git Branches and Worktrees:** Ensure all development happens in branches utilizing `git worktree` and that Pull Requests are fully tested before merge.
3. **CI/CD:** Always run GitHub Actions formatters and linters (`black`, `flake8`) locally before committing if possible, but trust the PR status checks.
