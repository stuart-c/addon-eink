# eInk Layout Manager

A Home Assistant Addon for managing complex layouts across multiple eInk displays using the OpenDisplay integration.

## Installation

This repository functions as a standard Home Assistant custom Add-on repository. You can add it directly to your Home Assistant instance using the button below:

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fstuart-c%2Faddon-eink)

Alternatively, add it manually:
1. Navigate in your Home Assistant frontend to **Settings** -> **Add-ons** -> **Add-on store**.
2. Click the three vertical dots (&#8942;) in the upper right corner and select **Repositories**.
3. Add `https://github.com/stuart-c/addon-eink` and click **Add**.
4. The add-on will now be available for configuration and installation.

## Development

The recommended way to develop for this repository is using **VS Code Dev Containers**. This ensures a consistent environment with all dependencies and tools pre-configured.

1. Open the repository in VS Code.
2. Click **"Reopen in Container"** when prompted.

For detailed development processes, architectural overview, and mandatory agent workflows, see:
- [Agent Workflow Guide](agents.md)
- [Agent Documentation Index](agent_docs/00_INDEX.md)