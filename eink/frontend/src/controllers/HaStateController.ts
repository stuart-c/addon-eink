import { ReactiveController, ReactiveControllerHost } from 'lit';
import { api, DisplayType, Layout, LayoutItem, Image, Scene, HaDevice } from '../services/HaApiClient';

/**
 * A Lit Reactive Controller to manage the application state:
 * - Layouts collection
 * - Display Types collection
 * - Active Layout selection
 * - Backend connectivity
 */
export type AppSection = 'display-types' | 'layouts' | 'images' | 'scenes';
export type ViewMode = 'graphical' | 'yaml';

export class HaStateController implements ReactiveController {
  public connected = false;
  public displayTypes: DisplayType[] = [];
  public layouts: Layout[] = [];
  public images: Image[] = [];
  public scenes: Scene[] = [];
  public haDevices: HaDevice[] = [];
  public activeLayout: Layout | null = null;
  public activeScene: Scene | null = null;
  public selectedItemId: string | null = null;
  public selectedImageId: string | null = null;
  public selectedDisplayTypeId: string | null = null;
  public isAddingNew = false;
  public activeSection: AppSection = 'layouts';
  public message: string = '';
  private _originalLayout: string | null = null;
  public isSaving = false;
  public viewMode: ViewMode = 'graphical';
  public sceneFilterLayoutId: string | null = null;

  constructor(private host: ReactiveControllerHost) {
    this.host.addController(this);
  }

  get isDirty() {
    if (!this.activeLayout) return false;
    return JSON.stringify(this.activeLayout) !== this._originalLayout;
  }

  async hostConnected() {
    window.addEventListener('hashchange', () => this._applyHash());
    await this.refresh();
  }

  async refresh() {
    this.connected = await api.ping();
    if (!this.connected) {
      console.warn('[HaStateController] ping failed, backend unreachable');
      return;
    }

    console.info('[HaStateController] refresh started');
    
    // Helper to fetch and log
    const fetchSafe = async <T>(name: string, promise: Promise<T>, defaultValue: T): Promise<T> => {
      try {
        const result = await promise;
        console.debug(`[HaStateController] fetched ${name}:`, result);
        return result;
      } catch (e) {
        console.error(`[HaStateController] failed to fetch ${name}`, e);
        return defaultValue;
      }
    };

    this.displayTypes = await fetchSafe('displayTypes', api.getCollection<DisplayType>('display_type'), []);
    this.layouts = await fetchSafe('layouts', api.getCollection<Layout>('layout'), []);
    this.images = await fetchSafe('images', api.getImages(), []);
    this.scenes = await fetchSafe('scenes', api.getCollection<Scene>('scene'), []);
    this.haDevices = await fetchSafe('haDevices', api.getHaDevices(), []);
    
    console.info(`[HaStateController] Data summary: ${this.images.length} images, ${this.layouts.length} layouts`);

    if (this.layouts.length > 0) {
      if (!this.activeLayout) {
        this.activeLayout = this.layouts[0];
      } else {
        const fresh = this.layouts.find(l => l.id === this.activeLayout?.id);
        if (fresh) this.activeLayout = fresh;
      }
      this._originalLayout = this.activeLayout.id ? JSON.stringify(this.activeLayout) : null;
    } else {
      // Don't auto-create default layout if it already exists or if we failed to fetch
      // Creating a local one if none exist is fine
      await this.createDefaultLayout();
    }

    if (this.scenes.length > 0 && this.activeScene) {
      const fresh = this.scenes.find(s => s.id === this.activeScene?.id);
      if (fresh) this.activeScene = fresh;
    }

    this.host.requestUpdate();
    console.info('[HaStateController] refresh complete - host update requested');
    this._ensureSelection();
    this._applyHash();
  }

  /**
   * Refreshes only the image library collection.
   */
  async refreshImages(params: Record<string, any> = {}) {
    if (!this.connected) {
      this.connected = await api.ping();
      if (!this.connected) return;
    }

    try {
      this.images = await api.getImages(params);
      this.host.requestUpdate();
    } catch (e: any) {
      console.error('Image fetch failed', e);
    }
  }

  /**
   * Refreshes the scenes collection, optionally filtering by layout.
   */
  async refreshScenes(params: Record<string, any> = {}) {
    if (!this.connected) {
      this.connected = await api.ping();
      if (!this.connected) return;
    }

    try {
      this.scenes = await api.getCollection<Scene>('scene', params);
      this.host.requestUpdate();
    } catch (e: any) {
      console.error('Scene fetch failed', e);
    }
  }


  private async createDefaultLayout() {
    const defaultLayout: Omit<Layout, 'id'> = {
      name: 'Main Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    const result = await api.createItem<Layout>('layout', defaultLayout);
    this.activeLayout = result;
    this.layouts = [result];
    this._originalLayout = JSON.stringify(result);
  }

  async saveActiveLayout() {
    if (!this.activeLayout) return;
    
    this.isSaving = true;
    this.host.requestUpdate();
    
    try {
      let saved: Layout;
      if (this.activeLayout.id) {
        saved = await api.updateItem('layout', this.activeLayout.id, this.activeLayout);
        this.showMessage('Layout saved!', 'success');
      } else {
        saved = await api.createItem('layout', this.activeLayout);
        this.showMessage(`Layout "${saved.name}" created!`, 'success');
      }
      
      this.activeLayout = saved;
      this._originalLayout = JSON.stringify(saved);
      await this.refresh();
      this._updateHash();
    } catch (e: any) {
      this.showMessage(`Failed to save: ${e.message}`, 'error');
    } finally {
      this.isSaving = false;
      this.host.requestUpdate();
    }
  }

  async saveDisplayType(dt: DisplayType) {
    this.isSaving = true;
    this.host.requestUpdate();
    try {
      let saved: DisplayType;
      const exists = !!dt.id && this.displayTypes.some(existing => existing.id === dt.id);
      if (exists) {
        saved = await api.updateItem('display_type', dt.id, dt);
      } else {
        saved = await api.createItem('display_type', dt);
      }
      this.selectedDisplayTypeId = saved.id;
      this._updateHash();
      await this.refresh();
      this.isSaving = false;
      this.showMessage(`Display type "${saved.name}" saved!`, 'success');
    } catch (e: any) {
      this.showMessage(`Failed to save display type: ${e.message}`, 'error');
    } finally {
      this.isSaving = false;
      this.host.requestUpdate();
    }
  }

  async deleteDisplayType(dt: DisplayType): Promise<boolean> {
    const isInUse = this.layouts.some(l => l.items.some(i => i.display_type_id === dt.id));
    if (isInUse) {
      this.showMessage(`Cannot delete "${dt.name}": It is in use.`, 'error');
      return false;
    }

    try {
      const oldIndex = this.displayTypes.findIndex(existing => existing.id === dt.id);
      await api.deleteItem('display_type', dt.id);
      await this.refresh();
      this.showMessage(`Display type "${dt.name}" deleted.`, 'success');
      
      if (this.selectedDisplayTypeId === dt.id) {
        if (this.displayTypes.length > 0) {
          const newIndex = Math.min(oldIndex, this.displayTypes.length - 1);
          this.selectedDisplayTypeId = this.displayTypes[newIndex].id;
        } else {
          this.selectedDisplayTypeId = null;
        }
      }
      this._updateHash();
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete: ${e.message}`, 'error');
      return false;
    }
  }

  async deleteLayout(layout: Layout): Promise<boolean> {
    try {
      console.info(`[HaStateController] deleting layout: ${layout.id} (${layout.name})`);
      const oldIndex = this.layouts.findIndex(l => l.id === layout.id);
      await api.deleteItem('layout', layout.id);
      console.info(`[HaStateController] layout deleted successfully: ${layout.id}`);
      this.showMessage(`Layout "${layout.name}" deleted.`, 'success');
      await this.refresh();
      this.host.requestUpdate();

      if (this.activeLayout?.id === layout.id) {
        if (this.layouts.length > 0) {
          const newIndex = Math.min(oldIndex, this.layouts.length - 1);
          this.activeLayout = this.layouts[newIndex];
          this._originalLayout = JSON.stringify(this.activeLayout);
        } else {
          this.activeLayout = null;
          this._originalLayout = null;
        }
      }
      this._updateHash();
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete: ${e.message}`, 'error');
      return false;
    }
  }

  async deleteImage(image: Image): Promise<boolean> {
    try {
      await api.deleteItem('image', image.id);
      if (this.selectedImageId === image.id) {
        this.selectedImageId = null;
      }
      await this.refresh();
      this.showMessage(`Image "${image.name}" deleted.`, 'success');
      this._updateHash();
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete image: ${e.message}`, 'error');
      return false;
    }
  }

  async createScene(name: string, layout: string): Promise<Scene | null> {
    this.isSaving = true;
    this.host.requestUpdate();
    try {
      const newScene: Omit<Scene, 'id'> = { name, layout };
      const result = await api.createItem<Scene>('scene', newScene);
      this.activeScene = result;
      this._updateHash();
      await this.refresh();
      this.isSaving = false;
      this.showMessage(`Scene "${name}" created!`, 'success');
      return result;
    } catch (e: any) {
      this.showMessage(`Failed to create scene: ${e.message}`, 'error');
      return null;
    } finally {
      this.isSaving = false;
      this.host.requestUpdate();
    }
  }

  async updateScene(id: string, updates: Partial<Scene>) {
    this.isSaving = true;
    this.host.requestUpdate();
    try {
      const existing = this.scenes.find(s => s.id === id);
      const merged = { ...existing, ...updates };
      await api.updateItem('scene', id, merged);
      await this.refresh();
      if (this.activeScene?.id === id) {
        this.activeScene = this.scenes.find(s => s.id === id) || this.activeScene;
      }
      this.showMessage('Scene updated!', 'success');
      this._updateHash();
    } catch (e: any) {
      this.showMessage(`Failed to update scene: ${e.message}`, 'error');
    } finally {
      this.isSaving = false;
      this.host.requestUpdate();
    }
  }

  async updateActiveScene(updates: Partial<Scene>) {
    if (!this.activeScene) return;
    this.activeScene = { ...this.activeScene, ...updates };
    this.host.requestUpdate();
  }

  async saveActiveScene() {
    if (!this.activeScene) return;
    
    this.isSaving = true;
    this.host.requestUpdate();
    try {
      await api.updateItem('scene', this.activeScene.id, this.activeScene);
      await this.refresh();
      this.showMessage('Scene saved!', 'success');
    } catch (e: any) {
      this.showMessage(`Failed to save scene: ${e.message}`, 'error');
    } finally {
      this.isSaving = false;
      this.host.requestUpdate();
    }
  }

  async deleteScene(scene: Scene): Promise<boolean> {
    try {
      const oldIndex = this.scenes.findIndex(s => s.id === scene.id);
      await api.deleteItem('scene', scene.id);
      await this.refresh();
      this.showMessage(`Scene "${scene.name}" deleted.`, 'success');

      if (this.activeScene?.id === scene.id) {
        if (this.scenes.length > 0) {
          const newIndex = Math.min(oldIndex, this.scenes.length - 1);
          this.activeScene = this.scenes[newIndex];
        } else {
          this.activeScene = null;
        }
      }
      this._updateHash();
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete scene: ${e.message}`, 'error');
      return false;
    }
  }

  showMessage(text: string, _type: 'info' | 'success' | 'error' = 'info') {
    console.info(`[HaStateController] showMessage: ${text} (${_type})`);
    this.message = text;
    this.host.requestUpdate();
    setTimeout(() => {
      this.message = '';
      this.host.requestUpdate();
    }, 3000);
  }

  switchLayout(layout: Layout) {
    this.activeLayout = layout;
    this._originalLayout = JSON.stringify(layout);
    this.selectedItemId = null;
    this.isAddingNew = false;
    this.host.requestUpdate();
    this._updateHash();
  }

  public prepareNewLayout() {
    this.activeLayout = {
      id: '',
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    this._originalLayout = null; // No baseline for new layout
    this.selectedItemId = null;
    this.isAddingNew = true;
    this.host.requestUpdate();
    this._updateHash();
  }

  switchScene(scene: Scene) {
    this.selectScene(scene.id);
  }

  public selectScene(id: string | null) {
    this.activeScene = this.scenes.find(s => s.id === id) || null;
    this.host.requestUpdate();
    this._updateHash();
  }

  discardChanges() {
    if (!this.activeLayout || !this._originalLayout) return;
    this.activeLayout = JSON.parse(this._originalLayout);
    this.selectedItemId = null;
    this.host.requestUpdate();
  }

  updateActiveLayout(updates: Partial<Layout>) {
    if (!this.activeLayout) return;
    this.activeLayout = { ...this.activeLayout, ...updates };
    this.host.requestUpdate();
  }

  updateItem(itemId: string, updates: Partial<LayoutItem>) {
    if (!this.activeLayout) return;
    const items = this.activeLayout.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    this.activeLayout = { ...this.activeLayout, items };
    this.host.requestUpdate();
  }

  setSection(section: AppSection) {
    this.activeSection = section;
    this.host.requestUpdate();
    this._updateHash();
  }

  public selectItem(itemId: string | null) {
    this.selectedItemId = itemId;
    this.host.requestUpdate();
    this._updateHash();
  }

  public selectImage(imageId: string | null) {
    this.selectedImageId = imageId;
    this.host.requestUpdate();
    this._updateHash();
  }

  public selectDisplayType(id: string | null) {
    this.isAddingNew = (id === null);
    this.selectedDisplayTypeId = id;
    this.host.requestUpdate();
    this._updateHash();
  }

  public setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.host.requestUpdate();
    this._updateHash();
  }

  private _updateHash() {
    let hash = `#/${this.activeSection}`;
    
    if (this.activeSection === 'layouts' && this.activeLayout) {
      hash += `/${this.activeLayout.id}`;
      if (this.selectedItemId) {
        hash += `/item/${this.selectedItemId}`;
      }
    } else if (this.activeSection === 'scenes' && this.activeScene) {
      hash += `/${this.activeScene.id}`;
    } else if (this.activeSection === 'images' && this.selectedImageId) {
      hash += `/${this.selectedImageId}`;
    } else if (this.activeSection === 'display-types' && this.selectedDisplayTypeId) {
      hash += `/${this.selectedDisplayTypeId}`;
    }

    if (this.viewMode === 'yaml') {
      hash += '?mode=yaml';
    }

    if (window.location.hash === hash) return;

    window.location.hash = hash;
  }

  private _applyHash() {

    const hash = window.location.hash || '#/layouts';
    const [pathPart, queryPart] = hash.split('?');
    const path = pathPart.substring(2); // Remove '#/'
    const segments = path.split('/');
    
    const params = new URLSearchParams(queryPart || '');
    const mode = params.get('mode') as ViewMode;
    if (mode === 'yaml' || mode === 'graphical') {
      this.viewMode = mode;
    }

    const section = segments[0] as AppSection;
    if (['display-types', 'layouts', 'images', 'scenes'].includes(section)) {
      if (this.activeSection !== section) {
      this.activeSection = section;
      this.isAddingNew = false; // Reset when switching sections
    }
    }

    if (this.activeSection === 'layouts') {
      const layoutId = segments[1];
      if (layoutId) {
        const layout = this.layouts.find(l => l.id === layoutId);
        if (layout && this.activeLayout?.id !== layoutId) {
          this.activeLayout = layout;
          this._originalLayout = JSON.stringify(layout);
        }
      }
      const newItemId = (segments[2] === 'item' && segments[3]) ? segments[3] : null;
      if (this.selectedItemId !== newItemId) this.selectedItemId = newItemId;
    } else if (this.activeSection === 'scenes') {
      const sceneId = segments[1] || null;
      if (this.activeScene?.id !== sceneId) {
        const scene = sceneId ? this.scenes.find(s => s.id === sceneId) : null;
        this.activeScene = scene || null;
      }
    } else if (this.activeSection === 'images') {
      const imageId = segments[1] || null;
      if (this.selectedImageId !== imageId) this.selectedImageId = imageId;
    } else if (this.activeSection === 'display-types') {
      const displayTypeId = segments[1] || null;
      if (this.selectedDisplayTypeId !== displayTypeId) {
        this.selectedDisplayTypeId = displayTypeId;
        if (displayTypeId !== null) this.isAddingNew = false;
      }
    }

    this._ensureSelection();
    this.host.requestUpdate();
  }

  /**
   * Selection safety: ensures an item is selected for the current section
   * if items are available and none is currently active.
   */
  private _ensureSelection() {
    if (!this.activeLayout && this.layouts.length > 0) {
      this.activeLayout = this.layouts[0];
      this._originalLayout = JSON.stringify(this.activeLayout);
    }
    if (!this.selectedDisplayTypeId && this.displayTypes.length > 0) {
      if (!this.isAddingNew) {
        this.selectedDisplayTypeId = this.displayTypes[0].id;
      }
    }
    if (!this.activeScene && this.scenes.length > 0) {
      const availableScenes = this.sceneFilterLayoutId 
        ? this.scenes.filter(s => s.layout === this.sceneFilterLayoutId)
        : this.scenes;
      if (availableScenes.length > 0) {
        this.activeScene = availableScenes[0];
      }
    }
  }
}
