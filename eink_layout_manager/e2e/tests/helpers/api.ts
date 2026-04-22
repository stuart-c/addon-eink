/**
 * Shared API helper functions and TypeScript interfaces for E2E API tests.
 *
 * Provides typed convenience factories for each resource type so that
 * spec files stay focused on the behaviour under test rather than fixture
 * construction.
 */

import { APIRequestContext } from '@playwright/test';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Frame {
  border_width_mm: number;
  colour: string;
}

export interface Mat {
  colour: string;
}

export interface DisplayType {
  id: string;
  name: string;
  width_mm: number;
  height_mm: number;
  panel_width_mm: number;
  panel_height_mm: number;
  width_px: number;
  height_px: number;
  colour_type: 'MONO' | 'BWR' | 'BWY' | 'BWRY' | 'BWGBRY' | 'GRAYSCALE_4';
  frame: Frame;
  mat: Mat;
}

export interface LayoutItem {
  id: string;
  display_type_id: string;
  x_mm: number;
  y_mm: number;
  orientation: 'landscape' | 'portrait';
  device_id?: string;
}

export interface Layout {
  id: string;
  name: string;
  canvas_width_mm: number;
  canvas_height_mm: number;
  items: LayoutItem[];
  status?: 'draft' | 'active';
}

export interface Scene {
  id: string;
  name: string;
  layout: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageRecord {
  id: string;
  name: string;
  file_type: string;
  dimensions: ImageDimensions;
  artist?: string | null;
  collection?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  colour_depth?: number | null;
  license?: string | null;
  source?: string | null;
}

export interface ImageListResponse {
  items: ImageRecord[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

// ---------------------------------------------------------------------------
// Default fixture data
// ---------------------------------------------------------------------------

export const DEFAULT_DISPLAY_TYPE: DisplayType = {
  id: 'epd-test-dt',
  name: '2.13 inch EPD (test)',
  width_mm: 112,
  height_mm: 59,
  panel_width_mm: 110,
  panel_height_mm: 48,
  width_px: 250,
  height_px: 122,
  colour_type: 'MONO',
  frame: { border_width_mm: 5, colour: '#000000' },
  mat: { colour: '#FFFFFF' },
};

export const DEFAULT_LAYOUT: Layout = {
  id: 'test-layout',
  name: 'Test Layout',
  canvas_width_mm: 200,
  canvas_height_mm: 200,
  items: [],
};

export const DEFAULT_SCENE: Scene = {
  id: 'test-scene',
  name: 'Test Scene',
  layout: 'test-layout',
};


/**
 * Creates a display type via POST /api/display_type.
 * Merges `overrides` into the default fixture before posting.
 */
export async function createDisplayType(
  request: APIRequestContext,
  overrides: Partial<DisplayType> = {},
): Promise<DisplayType> {
  const payload = { ...DEFAULT_DISPLAY_TYPE, ...overrides };
  const response = await request.post('/api/display_type', { data: payload });
  if (!response.ok()) {
    throw new Error(
      `createDisplayType failed: ${response.status()} ${await response.text()}`,
    );
  }
  return response.json() as Promise<DisplayType>;
}

/**
 * Creates a layout via POST /api/layout.
 * Merges `overrides` into the default fixture before posting.
 */
export async function createLayout(
  request: APIRequestContext,
  overrides: Partial<Layout> = {},
): Promise<Layout> {
  const payload = { ...DEFAULT_LAYOUT, ...overrides };
  const response = await request.post('/api/layout', { data: payload });
  if (!response.ok()) {
    throw new Error(
      `createLayout failed: ${response.status()} ${await response.text()}`,
    );
  }
  return response.json() as Promise<Layout>;
}

/**
 * Creates a scene via POST /api/scene.
 * Merges `overrides` into the default fixture before posting.
 */
export async function createScene(
  request: APIRequestContext,
  overrides: Partial<Scene> = {},
): Promise<Scene> {
  const payload = { ...DEFAULT_SCENE, ...overrides };
  const response = await request.post('/api/scene', { data: payload });
  if (!response.ok()) {
    throw new Error(
      `createScene failed: ${response.status()} ${await response.text()}`,
    );
  }
  return response.json() as Promise<Scene>;
}

/**
 * Creates an image via POST /api/image as multipart/form-data.
 */
export async function createImage(
  request: APIRequestContext,
  filename: string = 'test-image.png',
  buffer?: Buffer,
): Promise<ImageRecord> {
  // A tiny 1x1 black PNG
  const basePng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64',
  );
  // Append a unique string to ensure the hash is different for each call by default
  const defaultPngData = Buffer.concat([basePng, Buffer.from(Date.now().toString() + Math.random().toString())]);
  const pngData = buffer || defaultPngData;

  const response = await request.post('/api/image', {
    multipart: {
      file: {
        name: filename,
        mimeType: 'image/png',
        buffer: pngData,
      },
    },
  });

  if (!response.ok()) {
    throw new Error(
      `createImage failed: ${response.status()} ${await response.text()}`,
    );
  }
  return response.json() as Promise<ImageRecord>;
}

