# Main Architecture

The `addon-eink` repository is designed to be deployed as a Home Assistant Addon. It provides a control system for managing a selection of eInk displays via the `OpenDisplay` (OpenEPaperLink) integration in Home Assistant, while offering a UI to handle multi-display complex layouts (like slicing, tiling, or synchronising content across several disjoint screens).

## Technology Stack

- **Container Environment:** Standard Home Assistant `alpine` Addon Base utilising the S6-overlay supervisor.
- **Backend Service:** Python 3 application utilising **aiohttp** for the asynchronous web server.
- **Database & Persistence:** 
    - **SQLAlchemy** with **aiosqlite** for relational metadata storage (SQLite database). This includes metadata for images, display types, layouts, and scenes.
    - **Local Filesystem** for binary assets:
        - **Production (HA):** `/data/image` and `/data/thumbnail`.
        - **Development:** Locally stores data in `.data` (used by `run_app.sh` and `run_dev.sh`).
- **Frontend UI:** **Lit Web Components** (to match Home Assistant Frontend styling and ecosystem).
- **Testing:** **pytest** with **pytest-aiohttp** and **pytest-asyncio** for backend verification.
- **Addon Integration:** Uses Home Assistant **Ingress** to securely surface the UI within the Home Assistant sidebar.

## Core Conceptual Flow

1. **Asset Management:** Users upload images via the frontend. The backend validates images, calculates SHA-256 hashes to prevent duplicates, generates thumbnails, and persists metadata in SQLite.
2. **Layout Configuration:** The Lit-based frontend provides interfaces to define layouts spanning multiple displays, selecting from uploaded images and configured display types.
3. **Image Processing:** Upon layout activation, the backend processes (scales, crops, dithers) the source images according to the layout requirements.
4. **Panel Execution:** The backend communicates with the Home Assistant `OpenDisplay` integration (via the HA API or WebSockets) to update the specific e-Ink panels with the appropriate graphical segments.
