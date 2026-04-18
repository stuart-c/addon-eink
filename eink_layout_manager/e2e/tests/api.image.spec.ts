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

// ---------------------------------------------------------------------------
// Filtering & Search
// ---------------------------------------------------------------------------

test('GET /api/image — filters by title, artist, collection', async ({ request }) => {
  const name1 = uid('filter-1') + '.png';
  const name2 = uid('filter-2') + '.png';
  const artist = uid('artist');
  
  const img1 = await createImage(request, name1);
  const img2 = await createImage(request, name2);
  
  // Update img1 with artist
  await request.put(`/api/image/${img1.id}`, { data: { ...img1, artist } });
  
  // Filter by title (substring)
  const respTitle = await request.get(`/api/image?title=${name1}`);
  const bodyTitle: ImageListResponse = await respTitle.json();
  expect(bodyTitle.items.length).toBe(1);
  expect(bodyTitle.items[0].id).toBe(img1.id);
  
  // Filter by artist
  const respArtist = await request.get(`/api/image?artist=${artist}`);
  const bodyArtist: ImageListResponse = await respArtist.json();
  expect(bodyArtist.items.length).toBe(1);
  expect(bodyArtist.items[0].id).toBe(img1.id);

  // Cleanup
  await request.delete(`/api/image/${img1.id}`);
  await request.delete(`/api/image/${img2.id}`);
});

test('GET /api/image — filters by keywords (OR logic)', async ({ request }) => {
  const img1 = await createImage(request, uid('kw1') + '.png');
  const img2 = await createImage(request, uid('kw2') + '.png');
  
  await request.put(`/api/image/${img1.id}`, { data: { ...img1, keywords: ['nature', 'forest'] } });
  await request.put(`/api/image/${img2.id}`, { data: { ...img2, keywords: ['urban', 'city'] } });
  
  // Filter for 'nature'
  let resp = await request.get('/api/image?keyword=nature');
  let body: ImageListResponse = await resp.json();
  expect(body.items.some(i => i.id === img1.id)).toBe(true);
  expect(body.items.some(i => i.id === img2.id)).toBe(false);
  
  // Filter for 'nature,urban' (OR)
  resp = await request.get('/api/image?keyword=nature,urban');
  body = await resp.json();
  expect(body.items.some(i => i.id === img1.id)).toBe(true);
  expect(body.items.some(i => i.id === img2.id)).toBe(true);

  // Cleanup
  await request.delete(`/api/image/${img1.id}`);
  await request.delete(`/api/image/${img2.id}`);
});

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

test('GET /api/image — sorts by name asc/desc', async ({ request }) => {
  const base = uid('sort');
  const nameA = base + '-A.png';
  const nameB = base + '-B.png';
  const nameC = base + '-C.png';
  
  const imgB = await createImage(request, nameB);
  const imgA = await createImage(request, nameA);
  const imgC = await createImage(request, nameC);
  
  // Sort asc
  let resp = await request.get(`/api/image?title=${base}&sort=name:asc`);
  let body: ImageListResponse = await resp.json();
  let names = body.items.map(i => i.name);
  expect(names).toEqual([nameA, nameB, nameC]);
  
  // Sort desc
  resp = await request.get(`/api/image?title=${base}&sort=name:desc`);
  body = await resp.json();
  names = body.items.map(i => i.name);
  expect(names).toEqual([nameC, nameB, nameA]);

  // Cleanup
  await request.delete(`/api/image/${imgA.id}`);
  await request.delete(`/api/image/${imgB.id}`);
  await request.delete(`/api/image/${imgC.id}`);
});

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

test('GET /api/image — respects limit and page', async ({ request }) => {
  const base = uid('pager');
  const ids: string[] = [];
  for (let i = 0; i < 5; i++) {
    const img = await createImage(request, `${base}-${i}.png`);
    ids.push(img.id);
  }
  
  // Limit 2
  const resp = await request.get(`/api/image?title=${base}&limit=2&sort=name:asc`);
  const body: ImageListResponse = await resp.json();
  expect(body.items.length).toBe(2);
  expect(body.pagination.total_items).toBe(5);
  expect(body.pagination.total_pages).toBe(3);
  expect(body.pagination.page).toBe(1);
  
  // Page 2
  const resp2 = await request.get(`/api/image?title=${base}&limit=2&page=2&sort=name:asc`);
  const body2: ImageListResponse = await resp2.json();
  expect(body2.items.length).toBe(2);
  expect(body2.pagination.page).toBe(2);
  expect(body2.items[0].name).toBe(`${base}-2.png`);

  // Cleanup
  for (const id of ids) await request.delete(`/api/image/${id}`);
});

// ---------------------------------------------------------------------------
// Keywords Resource
// ---------------------------------------------------------------------------

test('GET /api/image/keywords — returns keyword counts', async ({ request }) => {
  const img1 = await createImage(request, uid('kw-res1') + '.png');
  const img2 = await createImage(request, uid('kw-res2') + '.png');
  
  await request.put(`/api/image/${img1.id}`, { data: { ...img1, keywords: ['apple', 'banana'] } });
  await request.put(`/api/image/${img2.id}`, { data: { ...img2, keywords: ['apple', 'cherry'] } });
  
  const resp = await request.get('/api/image/keywords');
  expect(resp.status()).toBe(200);
  const body: { keyword: string; count: number }[] = await resp.json();
  
  const apple = body.find(k => k.keyword === 'apple');
  const banana = body.find(k => k.keyword === 'banana');
  
  expect(apple?.count).toBeGreaterThanOrEqual(2);
  expect(banana?.count).toBeGreaterThanOrEqual(1);

  // Cleanup
  await request.delete(`/api/image/${img1.id}`);
  await request.delete(`/api/image/${img2.id}`);
});

// ---------------------------------------------------------------------------
// Error Handling
// ---------------------------------------------------------------------------

test('POST /api/image — returns 400 for non-image file', async ({ request }) => {
  const response = await request.post('/api/image', {
    multipart: {
      file: {
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('this is not an image'),
      },
    },
  });
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('Invalid image file');
});

test('PUT /api/image/:id — returns 400 for read-only field update (dimensions)', async ({ request }) => {
  const created = await createImage(request, uid('ro') + '.png');
  
  const response = await request.put(`/api/image/${created.id}`, {
    data: {
      ...created,
      dimensions: { width: 999, height: 999 }
    }
  });
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toMatch(/read-only fields/);

  // Cleanup
  await request.delete(`/api/image/${created.id}`);
});

test('PUT /api/image/:id — returns 400 for ID mismatch', async ({ request }) => {
  const created = await createImage(request, uid('id-mismatch') + '.png');
  
  const response = await request.put(`/api/image/${created.id}`, {
    data: {
      ...created,
      id: 'wrong-id'
    }
  });
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe('ID in body does not match ID in URL');

  // Cleanup
  await request.delete(`/api/image/${created.id}`);
});
