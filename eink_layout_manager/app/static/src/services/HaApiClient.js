/**
 * API client for communicating with the addon backend.
 * Generic client using the /api/{resource_type} structure.
 */
export class HaApiClient {
  constructor() {
    this.baseUrl = '';
  }

  async _fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json();
  }

  // --- Generic CRUD ---

  async getCollection(resourceType) {
    return this._fetch(`api/${resourceType}`);
  }

  async getItem(resourceType, id) {
    return this._fetch(`api/${resourceType}/${id}`);
  }

  async createItem(resourceType, data) {
    return this._fetch(`api/${resourceType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(resourceType, id, data) {
    return this._fetch(`api/${resourceType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(resourceType, id) {
    return this._fetch(`api/${resourceType}/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Legacy Proxies ---

  async getLayouts() { return this.getCollection('layout'); }
  async updateLayout(id, layout) { return this.updateItem('layout', id, layout); }
  async getDisplayTypes() { return this.getCollection('display_type'); }

  // --- Health ---

  async ping() {
    try {
      // Use relative path to correctly inherit ingress subpath
      const response = await fetch(`${this.baseUrl}api/ping`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

export const api = new HaApiClient();
