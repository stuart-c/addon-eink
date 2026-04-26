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
  createScene,
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
  const payload: Omit<Layout, 'id'> = { 
    name: 'Empty Layout',
    canvas_width_mm: 100,
    canvas_height_mm: 100,
    items: []
  };

  const response = await request.post('/api/layout', { data: payload });
  expect(response.status()).toBe(201);

  const body: Layout = await response.json();
  expect(body.name).toBe(payload.name);
  expect(body.id).toBeDefined();
});

test('POST /api/layout — creation response matches GET response', async ({ request }) => {
  const payload: Omit<Layout, 'id'> = { 
    name: 'Parity Layout',
    canvas_width_mm: 100,
    canvas_height_mm: 100,
    items: []
  };

  const createResponse = await request.post('/api/layout', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: Layout = await createResponse.json();

  const getResponse = await request.get(`/api/layout/${created.id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: Layout = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/layout — creates a layout with display type items', async ({ request }) => {
  const dt = await createDisplayType(request, { name: 'Item Test DT' });
  const dtId = dt.id;

  const payload: Omit<Layout, 'id'> = {
    ...DEFAULT_LAYOUT,
    items: [{ display_type_id: dtId, x_mm: 10, y_mm: 20, orientation: 'portrait' }],
  };

  const response = await request.post('/api/layout', { data: payload });
  expect(response.status()).toBe(201);

  const body: Layout = await response.json();
  expect(body.items).toHaveLength(1);
  expect(body.items[0].display_type_id).toBe(dtId);
});

test('POST /api/layout — ignores client-provided ID and generates UUID', async ({ request }) => {
  const clientId = 'my-custom-layout-id';
  const response = await request.post('/api/layout', {
    data: { ...DEFAULT_LAYOUT, id: clientId },
  });
  expect(response.status()).toBe(201);
  const body: Layout = await response.json();
  expect(body.id).not.toBe(clientId);
  expect(body.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
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
  const created = await createLayout(request, { name: 'Get Test' });

  const response = await request.get(`/api/layout/${created.id}`);
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
  const created = await createLayout(request, { name: 'Update Test' });
  const id = created.id;

  const updated = {
    ...created,
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
  const created = await createLayout(request, { name: 'Mismatch Test' });
  const id = created.id;

  const response = await request.put(`/api/layout/${id}`, {
    data: { ...DEFAULT_LAYOUT, id: 'wrong-id' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toMatch(/ID in body does not match ID in URL/);
});

test('PUT /api/layout/:id — returns 404 for non-existent ID', async ({ request }) => {
  const payload = { ...DEFAULT_LAYOUT, id: 'ghost-id' };
  const response = await request.put('/api/layout/ghost-id', {
    data: payload,
  });
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/layout/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const created = await createLayout(request, { name: 'Delete Test' });
  const id = created.id;

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

test('DELETE /api/layout/:id — returns 400 when layout is in use by a scene', async ({ request }) => {
  const layout = await createLayout(request, { name: 'Ref Layout' });
  const layoutId = layout.id;

  const scene = await createScene(request, {
    name: 'Ref Scene',
    layout: layoutId,
  });
  const sceneId = scene.id;

  const deleteResponse = await request.delete(`/api/layout/${layoutId}`);
  expect(deleteResponse.status()).toBe(400);
  const body = await deleteResponse.json();
  expect(body.error).toBe('Conflict');

  // Clean up — delete scene first, then layout
  await request.delete(`/api/scene/${sceneId}`);
  const retryDelete = await request.delete(`/api/layout/${layoutId}`);
  expect(retryDelete.status()).toBe(200);
});

// ---------------------------------------------------------------------------
// Full CRUD lifecycle
// ---------------------------------------------------------------------------

test('layout — full CRUD lifecycle', async ({ request }) => {
  // Create
  const createResponse = await request.post('/api/layout', {
    data: { ...DEFAULT_LAYOUT, name: 'Lifecycle Layout' },
  });
  expect(createResponse.status()).toBe(201);
  const created = await createResponse.json();
  const id = created.id;
  expect(created.name).toBe('Lifecycle Layout');

  // Read
  const getResponse = await request.get(`/api/layout/${id}`);
  expect(getResponse.status()).toBe(200);
  expect((await getResponse.json()).id).toBe(id);

  // Update
  const putResponse = await request.put(`/api/layout/${id}`, {
    data: { ...created, name: 'Lifecycle Layout Updated' },
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

// ---------------------------------------------------------------------------
// Multi-create
// ---------------------------------------------------------------------------

test('POST /api/layout — can create multiple resources and they all appear in the list', async ({ request }) => {
  const names = [uid('multi-1'), uid('multi-2'), uid('multi-3')];
  const createdIds: string[] = [];

  for (const name of names) {
    const created = await createLayout(request, { name });
    createdIds.push(created.id);
  }

  const response = await request.get('/api/layout');
  expect(response.status()).toBe(200);
  const body: Layout[] = await response.json();

  for (const name of names) {
    expect(body.some(l => l.name === name)).toBe(true);
  }

  // Clean up
  for (const id of createdIds) {
    await request.delete(`/api/layout/${id}`);
  }
});

// ---------------------------------------------------------------------------
// Layout Status Field
// ---------------------------------------------------------------------------

test('Layout Status: new layout with no items is "draft"', async ({ request }) => {
  const layout = await createLayout(request, { items: [] });
  expect(layout.status).toBe('draft');
});

test('Layout Status: layout with items but missing device_id is "draft"', async ({ request }) => {
  const dt = await createDisplayType(request);
  const layout = await createLayout(request, {
    items: [{ display_type_id: dt.id, x_mm: 0, y_mm: 0, orientation: 'landscape', device_id: '' }]
  });
  expect(layout.status).toBe('draft');
});

test('Layout Status: layout with items and all have device_id is "active"', async ({ request }) => {
  const dt = await createDisplayType(request);
  const layout = await createLayout(request, {
    items: [{ display_type_id: dt.id, x_mm: 0, y_mm: 0, orientation: 'landscape', device_id: 'ha-device-1' }]
  });
  expect(layout.status).toBe('active');
});

test('Layout Status: updating layout items updates status', async ({ request }) => {
  const dt = await createDisplayType(request);
  
  // Create draft
  const layout = await createLayout(request, {
    items: [{ display_type_id: dt.id, x_mm: 0, y_mm: 0, orientation: 'landscape' }]
  });
  expect(layout.status).toBe('draft');

  // Update to active
  const updateResponse = await request.put(`/api/layout/${layout.id}`, {
    data: {
      ...layout,
      items: [{ ...layout.items[0], device_id: 'ha-device-1' }]
    }
  });
  expect(updateResponse.status()).toBe(200);
  const updated = await updateResponse.json();
  expect(updated.status).toBe('active');

  // Update back to draft (empty device_id)
  const draftResponse = await request.put(`/api/layout/${layout.id}`, {
    data: {
      ...updated,
      items: [{ ...updated.items[0], device_id: '' }]
    }
  });
  expect(draftResponse.status()).toBe(200);
  expect((await draftResponse.json()).status).toBe('draft');
});
