/**
 * E2E API tests for /api/layout
 *
 * Covers: full CRUD lifecycle, schema validation, duplicate detection,
 * and layouts containing items that reference display types.
 */

import { test, expect } from '@playwright/test';
import {
  createDisplayType,
  createLayout,
  DEFAULT_LAYOUT,
  type Layout,
} from './helpers/api.js';

// ---------------------------------------------------------------------------
// Unique ID helpers
// ---------------------------------------------------------------------------

const uid = (suffix: string) => `e2e-layout-${suffix}-${Date.now()}`;

// ---------------------------------------------------------------------------
// GET collection
// ---------------------------------------------------------------------------

test('GET /api/layout — returns 200 with an array', async ({ request }) => {
  const response = await request.get('/api/layout');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
});

// ---------------------------------------------------------------------------
// POST create
// ---------------------------------------------------------------------------

test('POST /api/layout — creates a resource with no items and returns 201', async ({ request }) => {
  const payload: Layout = { ...DEFAULT_LAYOUT, id: uid('empty') };

  const response = await request.post('/api/layout', { data: payload });
  expect(response.status()).toBe(201);

  const body: Layout = await response.json();
  expect(body).toMatchObject(payload);
});

test('POST /api/layout — creation response matches GET response', async ({ request }) => {
  const id = uid('parity');
  const payload: Layout = { ...DEFAULT_LAYOUT, id };

  const createResponse = await request.post('/api/layout', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: Layout = await createResponse.json();

  const getResponse = await request.get(`/api/layout/${id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: Layout = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/layout — creates a layout with display type items', async ({ request }) => {
  const dtId = uid('dt');
  await createDisplayType(request, { id: dtId });

  const id = uid('with-items');
  const payload: Layout = {
    ...DEFAULT_LAYOUT,
    id,
    items: [{ display_type_id: dtId, x_mm: 10, y_mm: 20, orientation: 'portrait' }],
  };

  const response = await request.post('/api/layout', { data: payload });
  expect(response.status()).toBe(201);

  const body: Layout = await response.json();
  expect(body.items).toHaveLength(1);
  expect(body.items[0].display_type_id).toBe(dtId);
});

test('POST /api/layout — returns 409 for duplicate ID', async ({ request }) => {
  const id = uid('dup');
  await createLayout(request, { id });

  const response = await request.post('/api/layout', {
    data: { ...DEFAULT_LAYOUT, id },
  });
  expect(response.status()).toBe(409);
});

test('POST /api/layout — returns 400 for invalid schema', async ({ request }) => {
  // Missing required fields: canvas_width_mm, canvas_height_mm, items
  const response = await request.post('/api/layout', {
    data: { id: uid('bad'), name: 'Incomplete Layout' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

test('POST /api/layout — returns 400 for invalid item orientation', async ({ request }) => {
  const response = await request.post('/api/layout', {
    data: {
      ...DEFAULT_LAYOUT,
      id: uid('bad-orient'),
      items: [{ display_type_id: 'any', x_mm: 0, y_mm: 0, orientation: 'diagonal' }],
    },
  });
  expect(response.status()).toBe(400);
});

// ---------------------------------------------------------------------------
// GET by ID
// ---------------------------------------------------------------------------

test('GET /api/layout/:id — returns 200 with correct payload', async ({ request }) => {
  const id = uid('get');
  const created = await createLayout(request, { id });

  const response = await request.get(`/api/layout/${id}`);
  expect(response.status()).toBe(200);
  const body: Layout = await response.json();
  expect(body).toEqual(created);
});

test('GET /api/layout/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.get('/api/layout/does-not-exist');
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// PUT update
// ---------------------------------------------------------------------------

test('PUT /api/layout/:id — updates and returns 200', async ({ request }) => {
  const id = uid('update');
  await createLayout(request, { id });

  const updated: Layout = {
    ...DEFAULT_LAYOUT,
    id,
    name: 'Updated Layout Name',
    canvas_width_mm: 400,
  };

  const response = await request.put(`/api/layout/${id}`, { data: updated });
  expect(response.status()).toBe(200);
  const body: Layout = await response.json();
  expect(body.name).toBe('Updated Layout Name');
  expect(body.canvas_width_mm).toBe(400);
});

test('PUT /api/layout/:id — returns 400 when body ID mismatches URL ID', async ({ request }) => {
  const id = uid('mismatch');
  await createLayout(request, { id });

  const response = await request.put(`/api/layout/${id}`, {
    data: { ...DEFAULT_LAYOUT, id: 'wrong-id' },
  });
  expect(response.status()).toBe(400);
});

test('PUT /api/layout/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.put('/api/layout/ghost-id', {
    data: { ...DEFAULT_LAYOUT, id: 'ghost-id' },
  });
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/layout/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const id = uid('delete');
  await createLayout(request, { id });

  const response = await request.delete(`/api/layout/${id}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('deleted');

  // Verify gone
  const getResponse = await request.get(`/api/layout/${id}`);
  expect(getResponse.status()).toBe(404);
});

test('DELETE /api/layout/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.delete('/api/layout/no-such-thing');
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// Full CRUD lifecycle
// ---------------------------------------------------------------------------

test('layout — full CRUD lifecycle', async ({ request }) => {
  const id = uid('lifecycle');

  // Create
  const createResponse = await request.post('/api/layout', {
    data: { ...DEFAULT_LAYOUT, id, name: 'Lifecycle Layout' },
  });
  expect(createResponse.status()).toBe(201);
  expect((await createResponse.json()).name).toBe('Lifecycle Layout');

  // Read
  const getResponse = await request.get(`/api/layout/${id}`);
  expect(getResponse.status()).toBe(200);
  expect((await getResponse.json()).id).toBe(id);

  // Update
  const putResponse = await request.put(`/api/layout/${id}`, {
    data: { ...DEFAULT_LAYOUT, id, name: 'Lifecycle Layout Updated' },
  });
  expect(putResponse.status()).toBe(200);
  expect((await putResponse.json()).name).toBe('Lifecycle Layout Updated');

  // Delete
  const deleteResponse = await request.delete(`/api/layout/${id}`);
  expect(deleteResponse.status()).toBe(200);

  // Verify gone
  const afterDelete = await request.get(`/api/layout/${id}`);
  expect(afterDelete.status()).toBe(404);
});
