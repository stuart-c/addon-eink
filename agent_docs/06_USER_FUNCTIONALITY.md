# User Functionality Overview

This document provides a detailed account of the **Addon eInk** system from a user's perspective. It describes how to manage assets, configure hardware, design layouts, and compose scenes. This overview serves as a baseline for understanding current capabilities and planning new features.

## 1. Image Library
The Image Library is the central repository for all visual assets intended for display on e-ink hardware.

- **Upload & Management**: Users can upload common image formats which are automatically processed for e-ink compatibility.
- **Search & Filtering**:
    - **General Search**: Search by title, description, artist, or collection.
    - **Dimensions Filter**: Filter images by physical pixel dimensions (Width/Height) using range sliders.
    - **Classification**: Tag and filter images using keywords to organise large collections.
- **Sorting**: Multi-level sorting priority based on Name, Artist, Collection, Width, or Height. Users can define the order of sort criteria and the direction (Ascending/Descending).
- **Image Editing (via Metadata Dialog)**:
    - **Metadata**: Modify title, description, artist, and collection for better organisation.
    - **Image Properties**: Customise brightness, contrast, and saturation to fine-tune appearance on e-ink panels.
    - **Dithering**: Choose from various dithering algorithms (e.g., Floyd-Steinberg) to optimise how gradients and shades are represented with a limited colour palette.
    - **Palette**: Define or select specific colour palettes compatible with the target hardware.

## 2. Display Types
Display Types define the physical and technical characteristics of the e-ink hardware. This ensures the system can accurately represent and scale content for specific devices.

- **Physical Dimensions**: Define the outer frame size, border width, and panel size in millimetres.
- **Technical Specs**: 
    - Set the native pixel resolution (Width & Height).
    - Select the colour type (e.g., MONO, BWR, Greyscale 4-bit, Spectra 6) to ensure the image converter uses the correct dithering and palette logic.
- **Aesthetics**: Customise the frame and mat colour for a realistic visual preview on the management dashboard.
- **Visual Preview**: Real-time mock-up showing the hardware design, allowing users to see a "Dimension Summary" including calculated aperture and cutout positions.

## 3. Canvas Layouts
Layouts allow users to arrange one or more physical displays on a larger virtual surface, enabling combined digital displays.

- **Multi-Display Arrangement**: Position multiple "Items" (referencing Display Types) on a large canvas.
- **Graphical Editor**: A WYSIWYG editor where displays can be:
    - Dragged and positioned precisely.
    - Oriented in Landscape or Portrait mode.
    - Snapped to a configurable grid for alignment.
- **YAML Editor**: An alternative view for advanced users to directly edit the layout configuration in YAML format.
- **Canvas Properties**: Define the overall canvas width/height (in mm) and the grid-snapping granularity.

## 4. Smart Scenes
Smart Scenes are the high-level configurations that determine the actual content (images and data) shown on the displays.

- **Layout Association**: Each scene is based on a specific Canvas Layout.
- **Scene Items**:
    - **Single Display Item**: Assign a specific image or data source to one physical display within the layout.
    - **Multi-Display Tile (Tiling)**: Spans a single image across multiple displays (e.g., spanning an image across a 2x2 grid of four identical displays).
- **Composition**: Selection is done by clicking displays in the layout preview and adding them to the scene as items.

## 5. Typical Workflow
1.  **Define Hardware**: Create a **Display Type** for each unique e-ink device model.
2.  **Setup Canvas**: Create a **Layout** and arrange one or more display instances on the virtual canvas.
3.  **Build Library**: Upload **Images** and customise their properties (dithering, contrast) for e-ink.
4.  **Compose Scene**: Create a **Smart Scene**, select the Layout, and assign images to the displays or tiles.

## 6. Home Assistant Integration
The **Addon eInk** system is designed to work in tandem with Home Assistant, delegating system-wide orchestration and monitoring to the host platform.

- **Scheduling & Automation**: Changing scenes or rotating content is handled via Home Assistant Automations and Scripts. This allows for complex, event-driven scene transitions (e.g., changing the display based on time of day, weather, or home occupancy). As such, internal scheduling is considered out of scope for this application.
- **Display Monitoring**: Monitoring of physical device status (e.g., battery levels, connectivity, signal strength) is managed through Home Assistant sensors and entities. This provides a unified dashboard for all smart home hardware and is not implemented directly within the addon.

---

## Missing Functionality

The following gaps have been identified in the current system and represent opportunities for future development:

### Visual Truth & High-Fidelity Feedback
- **Scene-Level Live Preview**: Currently, the Scenes view shows boxes or placeholders. It lacks a true WISIWYG preview that renders the *actual processed images* as they will appear on the hardware.

### Performance & Latency
- **Event-Driven Conversion**: Image processing currently relies on a 60-second polling interval in the background. This should be replaced with an event-driven model that triggers processing immediately when an image or scene is updated.
- **Processing Feedback**: There is no visual indicator in the UI to show when a conversion is in progress or has failed.

### Advanced Management & Usability
- **Batch Operations**: Users must upload, tag, or delete images one by one. Bulk operations are not yet implemented.
- **Empty States**: Improving the onboarding experience with "getting started" guides or more descriptive prompts when no data exists.
- **Dark Mode**: The application lacks a native dark mode theme.

