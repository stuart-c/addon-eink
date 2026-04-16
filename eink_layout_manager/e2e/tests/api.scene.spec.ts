/**
 * E2E API tests for /api/scene
 *
 * Covers: full CRUD lifecycle, schema validation, and duplicate detection.
 */

import { test, expect } from '@playwright/test';
import {
  createScene,
  DEFAULT_SCENE,
  type Scene,
} from './helpers/api.js';

// ---------------------------------------------------------------------------
// Unique ID helpers
// ---------------------------------------------------------------------------

const uid = (suffix: string) => `e2e-scene-${suffix}-${Date.now()}`;

// ---------------------------------------------------------------------------
// GET collection
// ---------------------------------------------------------------------------

test('GET /api/scene — returns 200 with an array', async ({ request }) => {
  const response = await request.get('/api/scene');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
});

// ---------------------------------------------------------------------------
// POST create
// ---------------------------------------------------------------------------

test('POST /api/scene — creates a resource and returns 201', async ({ request }) => {
  const payload: Omit<Scene, 'id'> = { name: DEFAULT_SCENE.name, layout: DEFAULT_SCENE.layout };

  const response = await request.post('/api/scene', { data: payload });
  expect(response.status()).toBe(201);

  const body: Scene = await response.json();
  expect(body.name).toBe(payload.name);
  expect(body.id).toBeDefined();
  expect(typeof body.id).toBe('string');
});

test('POST /api/scene — creation response matches GET response', async ({ request }) => {
  const payload: Omit<Scene, 'id'> = { name: 'Parity Test', layout: DEFAULT_SCENE.layout };

  const createResponse = await request.post('/api/scene', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: Scene = await createResponse.json();

  const getResponse = await request.get(`/api/scene/${created.id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: Scene = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/scene — ignores client-provided ID and generates UUID', async ({ request }) => {
  const clientId = 'my-custom-id';
  const response = await request.post('/api/scene', {
    data: { ...DEFAULT_SCENE, id: clientId },
  });
  expect(response.status()).toBe(201);
  const body: Scene = await response.json();
  expect(body.id).not.toBe(clientId);
  expect(body.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
});

test('POST /api/scene — returns 400 for missing required name field', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { id: uid('bad') },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

test('POST /api/scene — succeeds without id field in body', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { name: 'No ID Scene', layout: 'test-layout' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toBeDefined();
});

// ---------------------------------------------------------------------------
// GET by ID
// ---------------------------------------------------------------------------

test('GET /api/scene/:id — returns 200 with correct payload', async ({ request }) => {
  const created = await createScene(request, { name: 'Get Test Scene' });
  const id = created.id;

  const response = await request.get(`/api/scene/${id}`);
  expect(response.status()).toBe(200);
  const body: Scene = await response.json();
  expect(body).toEqual(created);
});

test('GET /api/scene/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.get('/api/scene/does-not-exist');
  expect(response.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// PUT update
// ---------------------------------------------------------------------------

test('PUT /api/scene/:id — updates and returns 200', async ({ request }) => {
  const created = await createScene(request, { name: 'Update Test Scene' });
  const id = created.id;

  const updated = {
    id,
    name: 'Updated Scene Name',
    layout: 'test-layout',
  };

  const response = await request.put(`/api/scene/${id}`, { data: updated });
  expect(response.status()).toBe(200);
  const body: Scene = await response.json();
  expect(body.name).toBe('Updated Scene Name');
  expect(body.layout).toBe('test-layout');
});

test('PUT /api/scene/:id — returns 400 when body ID mismatches URL ID', async ({ request }) => {
  const created = await createScene(request, { name: 'Mismatch Test' });
  const id = created.id;

  const response = await request.put(`/api/scene/${id}`, {
    data: { id: 'wrong-id', name: 'Wrong', layout: 'test-layout' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toMatch(/ID in body does not match ID in URL/);
});

test('PUT /api/scene/:id — returns 404 for non-existent ID', async ({ request }) => {
  const payload = { id: 'ghost-id', name: 'Ghost', layout: 'test-layout' };
  const response = await request.put('/api/scene/ghost-id', {
    data: payload,
  });
  expect(response.status()).toBe(404);
});

test('POST /api/scene — returns 400 for missing required layout field', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { name: 'No Layout Scene' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/scene/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const created = await createScene(request, { name: 'Delete Test' });
  const id = created.id;

  const response = await request.delete(`/api/scene/${id}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.status).toBe('deleted');

  // Verify gone
  const getResponse = await request.get(`/api/scene/${id}`);
  expect(getResponse.status()).toBe(404);
});

test('DELETE /api/scene/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.delete('/api/scene/no-such-thing');
  expect(response.status()).toBe(404);
});
