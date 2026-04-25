# Open Questions

This file serves as a ledger of unknown design components. Agents should resolve these questions in collaboration with the user before committing to hard implementations.

## Resolved Design Decisions

- **Metadata Storage:** Images, Display Types, Layouts, and Scenes are persisted in a **SQLite database** using SQLAlchemy and aiosqlite. 
- **Image Processing Engines:**
    - **Pillow (PIL):** Used for metadata extraction, basic cropping, scaling, and thumbnail generation.
    - **Node.js Canvas & epdoptimize:** A dedicated Node.js utility handles high-quality dithering and palette conversion.
- **OpenDisplay Integration:** The backend interacts with the OpenDisplay integration using the `opendisplay.upload_image` service via the Home Assistant Core API.
- **Scene Slicing:** Background scene processing automatically slices and tiles images for multi-display layouts, generating per-display assets.
- **Asymmetrical Mat Support:** The `DisplayType` schema supports both symmetrical thickness and asymmetrical (horizontal/vertical) mat dimensions.
- **Display Orientation Normalisation:** All `DisplayType` records are normalised to landscape orientation in the database to ensure consistency in dimension handling.

## Out of Scope

- **Scheduling & Automation:** Content rotation and scene scheduling are handled natively by Home Assistant Automations and are not implemented within the addon.
- **Display Health Monitoring:** Monitoring of hardware status (battery, signal) is managed via Home Assistant sensor entities.

## Active Questions

### Latency and Feedback

- **Event-Driven Conversion Triggers:** How should frontend "save" actions trigger immediate backend processing to bypass the current 60-second polling lag?
- **Processing Feedback:** What is the best way to signal "Conversion in Progress" vs "Conversion Failed" to the user in the UI?

### Visual Truth

- **Scene Preview Fidelity:** Should the UI move from CSS-based transforms to fetching the "final" processed slices from the backend for the scene editor preview?

