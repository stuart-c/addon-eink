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
  const payload: Omit<DisplayType, 'id'> = { ...DEFAULT_DISPLAY_TYPE };

  const response = await request.post('/api/display_type', { data: payload });
  expect(response.status()).toBe(201);

  const body: DisplayType = await response.json();
  expect(body.name).toBe(payload.name);
  expect(body.id).toBeDefined();
});

test('POST /api/display_type — creation response matches GET response', async ({ request }) => {
  const payload: Omit<DisplayType, 'id'> = { ...DEFAULT_DISPLAY_TYPE, name: 'Parity DT' };

  const createResponse = await request.post('/api/display_type', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: DisplayType = await createResponse.json();

  const getResponse = await request.get(`/api/display_type/${created.id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: DisplayType = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/display_type — ignores client-provided ID and generates UUID', async ({ request }) => {
  const clientId = 'my-custom-dt-id';
  const response = await request.post('/api/display_type', {
    data: { ...DEFAULT_DISPLAY_TYPE, id: clientId },
  });
  expect(response.status()).toBe(201);
  const body: DisplayType = await response.json();
  expect(body.id).not.toBe(clientId);
  expect(body.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
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
  const created = await createDisplayType(request, { name: 'Get Test DT' });

  const response = await request.get(`/api/display_type/${created.id}`);
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
  const created = await createDisplayType(request, { name: 'Update Test DT' });
  const id = created.id;

  const updated = {
    ...created,
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
  const created = await createDisplayType(request, { name: 'Mismatch Test' });
  const id = created.id;

  const response = await request.put(`/api/display_type/${id}`, {
    data: { ...DEFAULT_DISPLAY_TYPE, id: 'wrong-id' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  // The mismatch error triggers before or alongside the read-only check
  expect(body.error).toMatch(/ID in body does not match ID in URL/);
});

test('PUT /api/display_type/:id — returns 404 for non-existent ID', async ({ request }) => {
  const payload = { ...DEFAULT_DISPLAY_TYPE, id: 'ghost-id' };
  const response = await request.put('/api/display_type/ghost-id', {
    data: payload,
  });
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/display_type/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const created = await createDisplayType(request, { name: 'Delete Test' });
  const id = created.id;

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
  const dt = await createDisplayType(request, { name: 'Ref DT' });
  const dtId = dt.id;
  
  const layout = await createLayout(request, {
    name: 'Ref Layout',
    items: [{ display_type_id: dtId, x_mm: 0, y_mm: 0, orientation: 'landscape' }],
  });
  const layoutId = layout.id;

  const deleteResponse = await request.delete(`/api/display_type/${dtId}`);
  expect(deleteResponse.status()).toBe(400);
  const body = await deleteResponse.json();
  expect(body.error).toBe('Conflict');

  // Clean up — delete layout first, then display type
  await request.delete(`/api/layout/${layoutId}`);
  const retryDelete = await request.delete(`/api/display_type/${dtId}`);
  expect(retryDelete.status()).toBe(200);
});
