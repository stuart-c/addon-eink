import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HaApiClient } from './HaApiClient';

describe('HaApiClient', () => {
  let client: HaApiClient;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockClear();
    client = new HaApiClient();
  });

  describe('_fetch', () => {
    it('should handle successful JSON responses', async () => {
      const mockData = { foo: 'bar' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
        headers: new Headers({ 'content-length': '10' })
      });

      const result = await (client as any)._fetch('/test');
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.any(Object));
    });

    it('should handle 204 No Content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers()
      });

      const result = await (client as any)._fetch('/test');
      expect(result).toBeNull();
    });

    it('should throw Error on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' })
      });

      await expect((client as any)._fetch('/test')).rejects.toThrow('Resource not found');
    });

    it('should handle empty response with content-length header 0', async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-length': '0' })
        });
  
        const result = await (client as any)._fetch('/test');
        expect(result).toBeNull();
      });
  });

  describe('Resource Methods', () => {
    it('getCollection should use GET', async () => {
       mockFetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });
      await client.getCollection('layout');
      expect(mockFetch).toHaveBeenCalledWith('api/layout', expect.objectContaining({
        headers: { 'Content-Type': 'application/json' }
      }));
    });

    it('getItem should use GET with ID', async () => {
        mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({ id: '123' })
       });
       await client.getItem('layout', '123');
       expect(mockFetch).toHaveBeenCalledWith('api/layout/123', expect.any(Object));
     });

    it('createItem should use POST and stringify body', async () => {
       mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new' })
      });
      await client.createItem('layout', { name: 'New' });
      expect(mockFetch).toHaveBeenCalledWith('api/layout', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New' })
      }));
    });

    it('updateItem should use PUT and stringify body', async () => {
        mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({ id: '123', name: 'Updated' })
       });
       await client.updateItem('layout', '123', { name: 'Updated' });
       expect(mockFetch).toHaveBeenCalledWith('api/layout/123', expect.objectContaining({
         method: 'PUT',
         body: JSON.stringify({ name: 'Updated' })
       }));
     });

     it('deleteItem should use DELETE', async () => {
        mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({ status: 'ok' })
       });
       await client.deleteItem('layout', '123');
       expect(mockFetch).toHaveBeenCalledWith('api/layout/123', expect.objectContaining({
         method: 'DELETE'
       }));
     });

    it('uploadImage should use FormData and NOT set Content-Type header manually', async () => {
       mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'img1' })
      });
      const file = new File([''], 'test.png', { type: 'image/png' });
      await client.uploadImage(file);
      
      const call = mockFetch.mock.calls[0];
      expect(call[0]).toBe('api/image');
      expect(call[1].method).toBe('POST');
      expect(call[1].body).toBeInstanceOf(FormData);
      expect(call[1].headers['Content-Type']).toBeUndefined();
    });

    it('getImages should return items from paginated response', async () => {
        const mockResp = {
            items: [{ id: 'img1' }],
            pagination: { page: 1, limit: 10, total_items: 1, total_pages: 1 }
        };
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockResp
        });
        const result = await client.getImages();
        expect(result).toEqual(mockResp.items);
    });

    it('getKeywords should return keyword list', async () => {
        const mockKeywords = [{ keyword: 'test', count: 5 }];
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockKeywords
        });
        const result = await client.getKeywords();
        expect(result).toEqual(mockKeywords);
    });
  });

  describe('ping', () => {
    it('should return true if fetch is ok', async () => {
      mockFetch.mockResolvedValue({ ok: true });
      const result = await client.ping();
      expect(result).toBe(true);
    });

    it('should return false if fetch is not ok', async () => {
      mockFetch.mockResolvedValue({ ok: false });
      const result = await client.ping();
      expect(result).toBe(false);
    });

    it('should return false if fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const result = await client.ping();
      expect(result).toBe(false);
    });
  });
});
