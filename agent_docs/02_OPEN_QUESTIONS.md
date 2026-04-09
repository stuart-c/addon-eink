# Open Questions

This file serves as a ledger of unknown design components. Agents should resolve these questions in collaboration with the user before committing to hard implementations.

## Networking and Interaction

- **OpenDisplay Integration Details:** How specifically will our Python backend authenticate and interact with the OpenDisplay HA Integration? Are there existing wrappers available, or do we interact via standard HA Automations/Services API over REST/Websockets?

## Image Processing

- **Image Engine Constraints:** For slicing/tiling large images across eInk screens, do we rely strictly on Pillow (`PIL`), or are there external tools we need (like ImageMagick)?
- **Colour Depth and Dithering:** Do we implement our own multi-colour dither logic, or rely on OpenDisplay doing that conversion natively?

## General Scope

- **Storage:** How and where do we persist layout configurations? (Standard HA Addon JSON storage via `/data` volume, or something more complex like SQLite database?)
