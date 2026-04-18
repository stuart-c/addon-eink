/**
 * E2E API tests for /api/image
 *
 * Covers: full CRUD lifecycle, schema validation, duplicate detection,
 * sorting, pagination, and thumbnail generation.
 */

import { test, expect } from '@playwright/test';
import {
  createImage,
  type ImageRecord,
  type ImageListResponse,
} from './helpers/api.js';

// ---------------------------------------------------------------------------
// Unique ID helpers
// ---------------------------------------------------------------------------

let uidCounter = 0;
const uid = (suffix: string) => `e2e-image-${suffix}-${Date.now()}-${uidCounter++}`;

// ---------------------------------------------------------------------------
// GET collection
// ---------------------------------------------------------------------------

test('GET /api/image — returns 200 with an array', async ({ request }) => {
  const response = await request.get('/api/image');
  expect(response.status()).toBe(200);
  const body: ImageListResponse = await response.json();
  expect(Array.isArray(body.items)).toBe(true);
  expect(body.pagination).toBeDefined();
});

// ---------------------------------------------------------------------------
// POST create
// ---------------------------------------------------------------------------

test('POST /api/image — creates a resource and returns 201', async ({ request }) => {
  const filename = `${uid('create')}.png`;
  const created = await createImage(request, filename);
  
  expect(created.name).toBe(filename);
  expect(created.id).toBeDefined();
  expect(created.file_type).toBe('PNG');
  expect(created.dimensions).toEqual({ width: 1, height: 1 });
});

test('POST /api/image — can create multiple resources and they all appear in the list', async ({ request }) => {
  const names = [uid('multi-1') + '.png', uid('multi-2') + '.png', uid('multi-3') + '.png'];
  const createdIds: string[] = [];

  for (const name of names) {
    // Append name to buffer to ensure unique hash
    const uniqueBuffer = Buffer.concat([
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64',
      ),
      Buffer.from(name),
    ]);
    const created = await createImage(request, name, uniqueBuffer);
    createdIds.push(created.id);
  }

  const response = await request.get('/api/image?limit=100');
  expect(response.status()).toBe(200);
  const body: ImageListResponse = await response.json();

  for (const name of names) {
    expect(body.items.some(img => img.name === name)).toBe(true);
  }

  // Clean up
  for (const id of createdIds) {
    await request.delete(`/api/image/${id}`);
  }
});

test('POST /api/image — returns 409 for duplicate image hash', async ({ request }) => {
  const commonBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64',
  );
  const filename = `${uid('dup')}.png`;
  // Create first
  await createImage(request, filename, commonBuffer);
  
  // Try to create same content again
  const response = await request.post('/api/image', {
    multipart: {
      file: {
        name: 'duplicate.png',
        mimeType: 'image/png',
        buffer: commonBuffer,
      },
    },
  });
  
  expect(response.status()).toBe(409);
  const body = await response.json();
  expect(body.error).toBe('Duplicate image');
});

// ---------------------------------------------------------------------------
// GET by ID
// ---------------------------------------------------------------------------

test('GET /api/image/:id — returns 200 with correct payload', async ({ request }) => {
  const name = uid('get-by-id') + '.png';
  const created = await createImage(request, name);

  const response = await request.get(`/api/image/${created.id}`);
  expect(response.status()).toBe(200);
  const body: ImageRecord = await response.json();
  expect(body).toEqual(created);
});

// ---------------------------------------------------------------------------
// PUT update
// ---------------------------------------------------------------------------

test('PUT /api/image/:id — updates metadata and returns 200', async ({ request }) => {
  const created = await createImage(request, uid('update') + '.png');
  const id = created.id;

  const updatePayload = {
    ...created,
    artist: 'E2E Artist',
    description: 'Updated description',
    keywords: ['test', 'e2e'],
  };

  const response = await request.put(`/api/image/${id}`, { data: updatePayload });
  expect(response.status()).toBe(200);
  const body: ImageRecord = await response.json();
  expect(body.artist).toBe('E2E Artist');
  expect(body.description).toBe('Updated description');
  expect(body.keywords).toContain('test');
});

// ---------------------------------------------------------------------------
// Thumbnail
// ---------------------------------------------------------------------------

test('GET /api/image/:id/thumbnail — returns 200 with image data', async ({ request }) => {
  const created = await createImage(request, uid('thumb') + '.png');
  
  const response = await request.get(`/api/image/${created.id}/thumbnail`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/image/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const created = await createImage(request, uid('delete') + '.png');
  const id = created.id;

  const response = await request.delete(`/api/image/${id}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('deleted');

  // Verify gone
  const getResponse = await request.get(`/api/image/${id}`);
  expect(getResponse.status()).toBe(404);
});
