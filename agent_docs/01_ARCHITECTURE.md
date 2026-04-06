# Main Architecture

The `addon-eink` repository is designed to be deployed as a Home Assistant Addon. It provides a control system for managing a selection of eInk displays via the `OpenDisplay` (OpenEPaperLink) integration in Home Assistant, while offering a UI to handle multi-display complex layouts (like slicing, tiling, or synchronizing content across several disjoint screens).

## Technology Stack

- **Container Environment:** Standard Home Assistant `alpine` Addon Base utilizing the S6-overlay supervisor.
- **Backend Service:** Python 3 application utilizing `aiohttp` or `FastAPI` (to match standard Home Assistant async paradigms).
- **Frontend UI:** Lit Web Components (to match Home Assistant Frontend styling and ecosystem).
- **Testing:** `pytest` for Python backend testing.
- **Addon Integration:** Uses HA **Ingress** to securely surface the UI within the Home Assistant sidebar.

## Core Conceptual Flow

1. **User Interaction:** The user accesses the Addon via the Home Assistant Sidebar (Ingress).
2. **Layout Management (UI):** The Lit-based frontend provides interfaces to assign images/content and designate complex layouts spanning multiple displays.
3. **Processing (Backend):** The backend splits/formats the images given the configuration requirements. 
4. **Execution (Control):** The backend commands the Home Assistant `OpenDisplay` integration (via HA API or Home Assistant WebSockets) to update the specific eInk panels with the appropriate graphical chunks.
