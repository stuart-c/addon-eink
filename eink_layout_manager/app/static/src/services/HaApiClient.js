/**
 * API client for communicating with the addon backend.
 * Handles communication with /api/layout and /api/display_type.
 */
export class HaApiClient {
  constructor() {
    // In HA Addon environment, the backend is on the same host/port during Ingress
    // During dev, Vite proxy handles the /api prefix
    this.baseUrl = '';
  }

  /**
   * General fetch wrapper with error handling.
   */
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

    // DELETE might return 200 with status deleted, but we check if content exists
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json();
  }

  // --- Layouts ---

  async getLayouts() {
    return this._fetch('/api/layout');
  }

  async getLayout(id) {
    return this._fetch(`/api/layout/${id}`);
  }

  async createLayout(layout) {
    return this._fetch('/api/layout', {
      method: 'POST',
      body: JSON.stringify(layout),
    });
  }

  async updateLayout(id, layout) {
    return this._fetch(`/api/layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(layout),
    });
  }

  async deleteLayout(id) {
    return this._fetch(`/api/layout/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Display Types ---

  async getDisplayTypes() {
    return this._fetch('/api/display_type');
  }

  async getDisplayType(id) {
    return this._fetch(`/api/display_type/${id}`);
  }

  async createDisplayType(displayType) {
    return this._fetch('/api/display_type', {
      method: 'POST',
      body: JSON.stringify(displayType),
    });
  }

  async updateDisplayType(id, displayType) {
    return this._fetch(`/api/display_type/${id}`, {
      method: 'PUT',
      body: JSON.stringify(displayType),
    });
  }

  async deleteDisplayType(id) {
    return this._fetch(`/api/display_type/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Health ---

  async ping() {
    try {
      const response = await fetch(`${this.baseUrl}/ping`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

// Export a singleton instance
export const api = new HaApiClient();
