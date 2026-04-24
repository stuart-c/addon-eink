# Main Architecture

The `addon-eink` repository is designed to be deployed as a Home Assistant Addon. It provides a control system for managing a selection of eInk displays via the `OpenDisplay` (OpenEPaperLink) integration in Home Assistant, while offering a UI to handle multi-display complex layouts (like slicing, tiling, or synchronising content across several disjoint screens).

## Technology Stack

- **Container Environment:** Standard Home Assistant `alpine` Addon Base utilising the S6-overlay supervisor.
- **Backend Service:** Python 3 application utilising **aiohttp** for the asynchronous web server.
- **Database & Persistence:** 
    - **SQLAlchemy** with **aiosqlite** for relational metadata storage (SQLite database).
    - **Local Filesystem** for binary assets and processed image cache.
- **Image Processing Engines:**
    - **Pillow (PIL):** Used for metadata extraction, basic cropping, scaling, and thumbnail generation.
    - **Node.js Canvas & epdoptimize:** A dedicated Node.js utility handles high-quality dithering and palette conversion, utilising the shared `epdoptimize` library.
- **Frontend UI:** **Lit Web Components** (to match Home Assistant Frontend styling and ecosystem).
- **Testing:**
    - **pytest:** Backend unit and integration verification.
    - **Playwright:** End-to-end verification of the integrated system.
- **Addon Integration:** Uses Home Assistant **Ingress** to securely surface the UI within the Home Assistant sidebar.

## Core Conceptual Flow

1. **Asset Management:** Users upload images via the frontend. The backend validates images, calculates SHA-256 hashes to prevent duplicates, generates thumbnails, and persists metadata in SQLite.
2. **Layout Configuration:** The Lit-based frontend provides interfaces to define layouts spanning multiple displays, selecting from uploaded images and configured display types.
3. **Scene Composition:** Scenes define which images occupy which segments of a layout. Scene items are stored as an ordered list to support complex visual layering.
4. **Image Processing Pipeline:**
    - An asynchronous background worker monitors the `ImagePalette` table.
    - If an image requires a new conversion (due to a new palette or modified settings like brightness/contrast), the worker triggers the Node.js converter.
    - Converted images are cached on the filesystem to minimize redundant processing.
5. **Panel Execution:** The backend communicates with the Home Assistant `OpenDisplay` integration (via the HA API or WebSockets) to update the specific e-Ink panels with the appropriate graphical segments.

## Hardware Support

- **Display Types:** Supports a wide range of eInk display sizes and resolutions.
- **Colour Profiles:** Native support for various hardware colour types, including `BW`, `BWR`, and `BWGBRY` (Spectra 6).
- **Physical Mounting:** Supports asymmetrical mat thickness and frame dimensions to accurately represent the physical mounting of displays.
