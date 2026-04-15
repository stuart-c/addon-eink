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
  const payload: Scene = { ...DEFAULT_SCENE, id: uid('create') };

  const response = await request.post('/api/scene', { data: payload });
  expect(response.status()).toBe(201);

  const body: Scene = await response.json();
  expect(body).toMatchObject(payload);
});

test('POST /api/scene — creation response matches GET response', async ({ request }) => {
  const id = uid('parity');
  const payload: Scene = { ...DEFAULT_SCENE, id };

  const createResponse = await request.post('/api/scene', { data: payload });
  expect(createResponse.status()).toBe(201);
  const created: Scene = await createResponse.json();

  const getResponse = await request.get(`/api/scene/${id}`);
  expect(getResponse.status()).toBe(200);
  const fetched: Scene = await getResponse.json();

  expect(created).toEqual(fetched);
});

test('POST /api/scene — returns 409 for duplicate ID', async ({ request }) => {
  const id = uid('dup');
  await createScene(request, { id });

  const response = await request.post('/api/scene', {
    data: { ...DEFAULT_SCENE, id },
  });
  expect(response.status()).toBe(409);
});

test('POST /api/scene — returns 400 for missing required name field', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { id: uid('bad') },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

test('POST /api/scene — returns 400 for missing required id field', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { name: 'No ID Scene' },
  });
  // Missing ID field should return 400 (no id field in body)
  expect(response.status()).toBe(400);
});

// ---------------------------------------------------------------------------
// GET by ID
// ---------------------------------------------------------------------------

test('GET /api/scene/:id — returns 200 with correct payload', async ({ request }) => {
  const id = uid('get');
  const created = await createScene(request, { id });

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
  const id = uid('update');
  await createScene(request, { id });

  const updated: Scene = { id, name: 'Updated Scene Name', layout: 'test-layout' };

  const response = await request.put(`/api/scene/${id}`, { data: updated });
  expect(response.status()).toBe(200);
  const body: Scene = await response.json();
  expect(body.name).toBe('Updated Scene Name');
  expect(body.layout).toBe('test-layout');
});

test('PUT /api/scene/:id — returns 400 when body ID mismatches URL ID', async ({ request }) => {
  const id = uid('mismatch');
  await createScene(request, { id });

  const response = await request.put(`/api/scene/${id}`, {
    data: { id: 'wrong-id', name: 'Mismatch', layout: 'test-layout' },
  });
  expect(response.status()).toBe(400);
});

test('PUT /api/scene/:id — returns 404 for non-existent ID', async ({ request }) => {
  const response = await request.put('/api/scene/ghost-id', {
    data: { id: 'ghost-id', name: 'Ghost', layout: 'test-layout' },
  });
  expect(response.status()).toBe(404);
});

test('POST /api/scene — returns 400 for missing required layout field', async ({ request }) => {
  const response = await request.post('/api/scene', {
    data: { id: uid('no-layout'), name: 'No Layout Scene' },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Validation failed');
});

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

test('DELETE /api/scene/:id — deletes resource and returns {status: "deleted"}', async ({ request }) => {
  const id = uid('delete');
  await createScene(request, { id });

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
