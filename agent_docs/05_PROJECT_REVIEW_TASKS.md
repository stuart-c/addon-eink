# Project Review & Task List

This document provides a comprehensive review of the **addon-eink** project and a list of tasks to improve its structure, design, architecture, and functionality.

---

## 1. Structure & Architecture Critique

### Current State
- **Backend**: Python with `aiohttp`, SQLAlchemy, and a background task system.
- **Frontend**: Lit-based web application following a strict **MVC pattern**. Dedicated ViewControllers manage business logic, while `HaStateController` serves as the centralized Model/State.
- **Converter**: Node.js utility for image processing using `epdoptimize`.

### Critique
- **Frontend God Class**: `HaStateController.ts` handles too many responsibilities (fetching, CRUD, routing, messages, UI state). This makes it brittle and hard to test.
- **Manual Routing**: Routing is manually parsed from `window.location.hash`, which is fragile and limits deep linking.
- **Polling Latency**: The background image processor sleeps for 60s, causing delay in feedback after image adjustment.
- **API Monolith**: `HaApiClient` is a single file that is becoming crowded with helper methods and proxies.

---

## 2. Design & User Experience Critique

### Current State
- Clean but functional layout; standard Material-style components.
- Lacks a cohesive "premium" aesthetic and fluid interactions.

### Critique
- **Visual Polish**: The UI lacks the rich aesthetics expected of modern premium tools (e.g., refined shadows, glassmorphism, curated HSL color palettes, and custom typography).
- **Smooth Transitions**: Switching between views or saving items feels abrupt. There are no micro-animations or ghost-state transitions.
- **Onboarding Experience**: No polished "empty states" or "getting started" guides for new users with no data.
- **Theming**: No native support for a high-quality Dark Mode.

---

## 3. Functionality Gaps

### Current State
- Image management, layout composition, and scene item configuration are implemented.
- MQTT connectivity is mentioned in the backend but underutilized in the UI.

### Critique
- **Scene-Level Preview**: In the Scenes view, items are currently placeholders. Users cannot see the *actual images* rendered in position on the canvas preview.
- **Display Monitoring**: There is no dashboard to see the battery status, online state, or last-update time of the physical e-ink displays.
- **Scheduling/Automation**: No built-in way to schedule scene transitions or set an "Active" scene override.
- **Batch Operations**: Users must upload and delete images one by one. No bulk actions or advanced library management.

---

## 4. Proposed Task List

| Task | Description | Reason | Priority | Associated Prompt |
| :--- | :--- | :--- | :--- | :--- |
| **Refactor State Management** | Decouple `HaStateController` into focused controllers (Navigation, Notification, ResourceService). | Improve maintainability and reduce code complexity. | **COMPLETED** | "Refactor `HaStateController.ts` by splitting its responsibilities into smaller, focused Lit Reactive Controllers." |
| **Premium UI Overhaul** | Update `common-styles.ts` with a curated HSL color palette, modern typography, glassmorphism, and improved shadows. | Align with modern 'premium' web design standards. | **High** | "Update the application's global styles in `common-styles.ts` to use a premium design system with HSL colors, Inter/Outfit typography, and subtle micro-animations for interactions." |
| **Scene Item Live Preview** | Implement real image rendering in the canvas preview within `ScenesView`. | Allow users to see exactly what will be sent to the display. | **High** | "Enhance the `layout-editor` and `scenes-view` to fetch and render converted image previews directly on the canvas instead of showing placeholders." |
| **Display Health Dashboard** | Add a status section showing online state, battery, and signal strength for all configured devices. | Provide vital feedback on the physical hardware state. | **Medium** | "Implement a health dashboard or status bar that visualizes display-specific telemetry (battery, online status, last seen) fetched from the backend MQTT/Device state." |
| **Event-Driven Conversion** | Replace the 60s background sleep with a more responsive event-based image processing trigger. | Lower the latency between image editing and final preview generation. | **Medium** | "Optimize `image_processor.py` to trigger processing immediately upon image updates instead of relying on a 60-second polling interval." |
| **Standardized Component Library** | Create a set of shared, styled components (Buttons, Cards, Modals) for the entire frontend. | Ensure visual consistency and reduce CSS duplication. | **Medium** | "Create a library of reusable, premium-styled UI components in `frontend/src/components/shared` that all views should use." |
| **Batch Library Operations** | Implement bulk upload and multi-select deletion in the Image Library. | Improve usability for users with large image collections. | **Low** | "Add multi-select capabilities to the `ImagesView` to allow for batch deleting, keyword tagging, and bulk uploading." |
| **Integrated Dark Mode** | Implement a high-quality dark mode toggle with persistent state. | Improve user comfort and provide a more 'pro' appearance. | **Low** | "Implement a cohesive Dark Mode theme for the entire application, togglable via the header and persisted in local storage." |

---

## Summary of Next Steps

1.  **Refactor the Core**: Start by cleaning up the `HaStateController` and applying the premium design tokens.
2.  **Visual Truth**: Focus on the Scene Preview rendering so the UI becomes a true "What You See Is What You Get" (WYSIWYG) editor.
3.  **Hardware Feedback**: Enable the display monitoring features to bridge the gap between software configuration and hardware reality.
