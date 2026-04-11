/**
 * API client for communicating with the addon backend.
 * Generic client using the /api/{resource_type} structure.
 */

export interface DisplayType {
  id: string;
  name: string;
  width_mm: number;
  height_mm: number;
  panel_width_mm: number;
  panel_height_mm: number;
  width_px: number;
  height_px: number;
  colour_type: string;
  frame: {
    border_width_mm: number;
    colour: string;
  };
  mat: {
    colour: string;
  };
  description?: string;
}

export interface LayoutItem {
  id: string;
  display_type_id: string;
  x_mm: number;
  y_mm: number;
  orientation: number;
  invalid?: boolean;
}

export interface Layout {
  id: string;
  name: string;
  canvas_width_mm: number;
  canvas_height_mm: number;
  grid_snap_mm: number;
  items: LayoutItem[];
}

export interface Image {
  id: string;
  name: string;
  artist?: string;
  collection?: string;
  file_type: 'JPG' | 'PNG' | 'GIF' | 'WEBP' | 'BMP' | 'TIFF';
  dimensions: {
    width: number;
    height: number;
  };
  colour_depth?: number;
  keywords?: string[];
  description?: string;
  file_path: string;
  original_archive_file?: string;
  license?: string;
  source?: string;
  file_hash: string;
}

export interface KeywordInfo {
  keyword: string;
  count: number;
}

export type ResourceType = 'display_type' | 'layout' | 'image';

export class HaApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  private async _fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = { ...(options.headers as any) };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as any;
    }

    return response.json();
  }

  // --- Generic CRUD ---

  async getCollection<T>(resourceType: ResourceType): Promise<T[]> {
    return this._fetch<T[]>(`api/${resourceType}`);
  }

  async getItem<T>(resourceType: ResourceType, id: string): Promise<T> {
    return this._fetch<T>(`api/${resourceType}/${id}`);
  }

  async createItem<T>(resourceType: ResourceType, data: Partial<T>): Promise<T> {
    return this._fetch<T>(`api/${resourceType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem<T>(resourceType: ResourceType, id: string, data: Partial<T>): Promise<T> {
    return this._fetch<T>(`api/${resourceType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(resourceType: ResourceType, id: string): Promise<{ status: string }> {
    return this._fetch<{ status: string }>(`api/${resourceType}/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Legacy Proxies ---

  async getLayouts(): Promise<Layout[]> { return this.getCollection<Layout>('layout'); }
  async updateLayout(id: string, layout: Layout): Promise<Layout> { return this.updateItem<Layout>('layout', id, layout); }
  async getDisplayTypes(): Promise<DisplayType[]> { return this.getCollection<DisplayType>('display_type'); }
  async getImages(): Promise<Image[]> { return this.getCollection<Image>('image'); }
  async updateImage(id: string, image: Image): Promise<Image> { return this.updateItem<Image>('image', id, image); }
  async uploadImage(file: File): Promise<Image> {
    const formData = new FormData();
    formData.append('file', file);

    return this._fetch<Image>('api/image', {
      method: 'POST',
      body: formData,
    });
  }

  async getKeywords(): Promise<KeywordInfo[]> {
    return this._fetch<KeywordInfo[]>('api/image/keywords');
  }

  // --- Health ---

  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}api/ping`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

export const api = new HaApiClient();
