# Frontend MVC Refactor Plan

This document details the multi-phase strategy to migrate the frontend application from Lit's built-in component state management to an MVC (Model-View-Controller) architecture based around `ReactiveController`.

Due to the scale of the original refactor (~4,500 lines across 42 files) and complex integration issues like the Lit component update lifecycle looping when handling global `notifyDirty` events, the migration will be completed across 4 separate, reviewable Pull Requests.

## Overview of the Architecture

* **HaStateController:** Central state orchestrator connecting directly to the Home Assistant websocket API.
* **BaseViewController:** An abstract `ReactiveController` instance bound to UI views. Handles interactions explicitly and acts as the source of truth for the local view representation. View controllers communicate selectively back to the application shell via standard custom events.
* **Component Presentation:** Native `LitElement` classes stripped of all significant logical logic, simply rendering whatever state attributes the controllers expose.

## Phase 1: Core Framework & Display Types (Current)
* **Goal:** Prove the foundational architecture in isolation.
* **Implementation:** 
  1. Add `BaseViewController`.
  2. Modify `BaseResourceView` to implement decoupled communication handlers that don't bind blindly to `updated()` lifecycles.
  3. Migrate `DisplayTypesView` entirely to utilize `DisplayTypesViewController`.
  4. Ensure `app-root` receives generic framework events securely without conflicting with legacy components.

## Phase 2: Dialogs & Static Assets
* **Goal:** Migrate complex application dialogues and the decoupled Image Library pane.
* **Implementation:**
  1. Migrate the global `ConfirmDialog`, `ImageDialog`, and `LayoutSettingsDialog`.
  2. Implement `ImagesViewController` and migrate `ImagesView`.

## Phase 3: Layouts Infrastructure
* **Goal:** Migrate the core Layout builder canvas.
* **Implementation:**
  1. Port `LayoutEditorController`.
  2. Port `LayoutsViewController`.
  3. Convert both `LayoutEditor` and `LayoutsView` to purely presentational.

## Phase 4: Scenes Infrastructure & Shell 
* **Goal:** Wrap up the most complex dependency tree routing.
* **Implementation:**
  1. Port the `ScenesViewController` and `ScenesView`.
  2. Port `SceneItemSettingsDialog` and `SceneItemSettingsController`.
  3. Migrate the `AppToolbar` and `SideBar` components to use localized controllers. 
  4. Finish cleaning up legacy routines inside `app-root`.
