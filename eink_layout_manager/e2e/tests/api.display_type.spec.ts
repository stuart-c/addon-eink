/**
 * E2E API tests for /api/display_type
 *
 * Covers: full CRUD lifecycle, schema validation, duplicate detection,
 * and referential integrity protection when a display type is in use by a layout.
 */

import { test, expect } from '@playwright/test';
import {
  createDisplayType,
  createLayout,
  DEFAULT_DISPLAY_TYPE,
  type DisplayType,
} from './helpers/api.js';

// ---------------------------------------------------------------------------
// Unique ID helpers — each test run gets its own IDs to avoid state bleed
// ---------------------------------------------------------------------------

const uid = (suffix: string) => `e2e-dt-${suffix}-${Date.now()}`;

// ---------------------------------------------------------------------------
// GET collection
// ---------------------------------------------------------------------------

test('GET /api/display_type — returns 200 with an array', async ({ request }) => {
  const response = await request.get('/api/display_type');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
});

// ---------------------------------------------------------------------------
// POST create
// ---------------------------------------------------------------------------

test('POST /api/display_type — creates a resource and returns 201', async ({ request }) => {
  const payload: DisplayType = { ...DEFAULT_DISPLAY_TYPE, id: uid('create') };

  const response = await request.post('/api/display_type', { data: payload });
  expect(response.status()).toBe(201);

  const body: DisplayType = await response.json();
  expect(body).toMatchObject(payload);
});

test('POST /api/display_type — creation response matches GET response', async ({ request }) => {
  const payload: DisplayType = { ...DEFAULT_DISPLAY_TYPE, id: uid('parity') };

  const createResponse = await request.post('/api/display_type', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: DisplayType = await createResponse.json();

  const getResponse = await request.get(`/api/display_type/${payload.id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: DisplayType = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/display_type — returns 409 for duplicate ID', async ({ request }) => {
  const id = uid('dup');
  await createDisplayType(request, { id });

  const response = await request.post('/api/display_type', {
    data: { ...DEFAULT_DISPLAY_TYPE, id },
  });
  expect(response.status()).toBe(409);
});

test('POST /api/display_type — returns 400 for invalid schema', async ({ request }) => {
  // Missing required fields: width_mm, height_mm, colour_type, etc.
  const response = await request.post('/api/display_type', {
    data: { id: uid('bad'), name: 'Incomplete' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

test('POST /api/display_type — returns 400 for invalid colour_type enum', async ({ request }) => {
  const response = await request.post('/api/display_type', {
    data: { ...DEFAULT_DISPLAY_TYPE, id: uid('bad-colour'), colour_type: 'INVALID' },
  });
  expect(response.status()).toBe(400);
});

// ---------------------------------------------------------------------------
// GET by ID
// ---------------------------------------------------------------------------

test('GET /api/display_type/:id — returns 200 with correct payload', async ({ request }) => {
  const id = uid('get');
  const created = await createDisplayType(request, { id });

  const response = await request.get(`/api/display_type/${id}`);
  expect(response.status()).toBe(200);
  const body: DisplayType = await response.json();
  expect(body).toEqual(created);
});

test('GET /api/display_type/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.get('/api/display_type/does-not-exist');
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// PUT update
// ---------------------------------------------------------------------------

test('PUT /api/display_type/:id — updates and returns 200', async ({ request }) => {
  const id = uid('update');
  await createDisplayType(request, { id });

  const updated: DisplayType = {
    ...DEFAULT_DISPLAY_TYPE,
    id,
    name: 'Updated Display Type Name',
    width_px: 300,
  };

  const response = await request.put(`/api/display_type/${id}`, { data: updated });
  expect(response.status()).toBe(200);
  const body: DisplayType = await response.json();
  expect(body.name).toBe('Updated Display Type Name');
  expect(body.width_px).toBe(300);
});

test('PUT /api/display_type/:id — returns 400 when body ID mismatches URL ID', async ({ request }) => {
  const id = uid('mismatch');
  await createDisplayType(request, { id });

  const response = await request.put(`/api/display_type/${id}`, {
    data: { ...DEFAULT_DISPLAY_TYPE, id: 'wrong-id' },
  });
  expect(response.status()).toBe(400);
});

test('PUT /api/display_type/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.put('/api/display_type/ghost-id', {
    data: { ...DEFAULT_DISPLAY_TYPE, id: 'ghost-id' },
  });
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/display_type/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const id = uid('delete');
  await createDisplayType(request, { id });

  const response = await request.delete(`/api/display_type/${id}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('deleted');

  // Verify gone
  const getResponse = await request.get(`/api/display_type/${id}`);
  expect(getResponse.status()).toBe(404);
});

test('DELETE /api/display_type/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.delete('/api/display_type/no-such-thing');
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// Referential integrity
// ---------------------------------------------------------------------------

test('DELETE /api/display_type/:id — returns 400 when display type is in use by a layout', async ({ request }) => {
  const dtId = uid('ref-dt');
  const layoutId = uid('ref-layout');

  await createDisplayType(request, { id: dtId });
  await createLayout(request, {
    id: layoutId,
    items: [{ display_type_id: dtId, x_mm: 0, y_mm: 0, orientation: 'landscape' }],
  });

  const deleteResponse = await request.delete(`/api/display_type/${dtId}`);
  expect(deleteResponse.status()).toBe(400);
  const body = await deleteResponse.json();
  expect(body.error).toBe('Conflict');

  // Clean up — delete layout first, then display type
  await request.delete(`/api/layout/${layoutId}`);
  const retryDelete = await request.delete(`/api/display_type/${dtId}`);
  expect(retryDelete.status()).toBe(200);
});
