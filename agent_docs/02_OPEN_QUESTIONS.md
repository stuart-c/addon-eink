# Open Questions

This file serves as a ledger of unknown design components. Agents should resolve these questions in collaboration with the user before committing to hard implementations.

## Resolved Design Decisions

- **Storage:** Metadata (Images, Display Types, Layouts, Scenes) is persisted in a **SQLite database** using SQLAlchemy and aiosqlite. Binary assets and thumbnails are stored on the local filesystem.
- **Image Engine:** The backend utilises **Pillow (PIL)** for all image processing, including resizing, cropping, and thumbnail generation.
- **Colour Depth and Dithering:** Handled via Pillow integration with support for hardware-specific colour types (e.g., `BWGBRY` for Spectra 6).

## Active Questions

### Networking and Interaction

- **OpenDisplay Integration Details:** How specifically will our Python backend authenticate and interact with the OpenDisplay HA Integration? Are there existing wrappers available, or do we interact via standard HA Automations/Services API over REST/Websockets?
