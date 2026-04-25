import { ReactiveController, ReactiveControllerHost } from 'lit';
import { api, DisplayType, Layout, LayoutItem, Image, Scene, HaDevice } from '../services/HaApiClient';
import { NavigationController, AppSection, ViewMode } from './NavigationController';

/**
 * A Lit Reactive Controller to manage the application state:
 * - Layouts collection
 * - Display Types collection
 * - Backend connectivity
 * Delegates navigation and selection state to NavigationController.
 */

export interface AppMessage { text: string; type: 'success' | 'error' | 'warning' | 'info'; }

export class HaStateController implements ReactiveController {
  public connected = false;
  public displayTypes: DisplayType[] = [];
  public layouts: Layout[] = [];
  public images: Image[] = [];
  public scenes: Scene[] = [];
  public haDevices: HaDevice[] = [];
  public message: AppMessage | null = null;
  private _originalLayout: string | null = null;
  public isSaving = false;

  get activeSection() { return this.navigation.activeSection; }
  set activeSection(v) { this.navigation.setSection(v); }

  get viewMode() { return this.navigation.viewMode; }
  set viewMode(v) { this.navigation.setViewMode(v); }

  get selectedItemId() { return this.navigation.selectedItemId; }
  set selectedItemId(v) { this.navigation.selectItem(v); }

  get selectedImageId() { return this.navigation.selectedImageId; }
  set selectedImageId(v) { this.navigation.selectImage(v); }

  get selectedDisplayTypeId() { return this.navigation.selectedDisplayTypeId; }
  set selectedDisplayTypeId(v) { this.navigation.selectDisplayType(v); }

  get isAddingNew() { return this.navigation.isAddingNew; }
  set isAddingNew(v) { this.navigation.isAddingNew = v; }

  public activeLayout: Layout | null = null;
  public activeScene: Scene | null = null;

  constructor(private host: ReactiveControllerHost, public navigation: NavigationController) {
    this.host.addController(this);
    this.navigation.onHashApplied = () => this._syncFromNavigation();
  }

  private _syncFromNavigation() {
    const layout = this.layouts.find(l => l.id === this.navigation.activeLayoutId);
    if (layout && this.activeLayout?.id !== layout.id) {
      this.activeLayout = layout;
      this._originalLayout = JSON.stringify(layout);
    } else if (!this.navigation.activeLayoutId) {
      this.activeLayout = null;
      this._originalLayout = null;
    }

    const scene = this.scenes.find(s => s.id === this.navigation.activeSceneId);
    if (scene && this.activeScene?.id !== scene.id) {
      this.activeScene = scene;
    } else if (!this.navigation.activeSceneId) {
      this.activeScene = null;
    }
  }

  get isDirty() {
    if (!this.activeLayout) return false;
    return JSON.stringify(this.activeLayout) !== this._originalLayout;
  }

  async hostConnected() {
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
    this.navigation.updateHash();
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
    this.navigation.activeLayoutId = result.id;
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
      this.navigation.activeLayoutId = saved.id;
      this._originalLayout = JSON.stringify(saved);
      this.isAddingNew = false;
      await this.refresh();
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

      if (this.activeSection === 'layouts' && this.layouts.length > 0) {
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
      }
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
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete scene: ${e.message}`, 'error');
      return false;
    }
  }

  showMessage(text: string, type: 'info' | 'success' | 'error' = 'info') {
    console.info(`[HaStateController] showMessage: ${text} (${type})`);
    this.message = { text, type };
    this.host.requestUpdate();
    setTimeout(() => {
      if (this.message?.text === text) {
        this.message = null;
        this.host.requestUpdate();
      }
    }, 5000);
  }

  switchLayout(layout: Layout) {
    this.activeLayout = layout;
    this.navigation.activeLayoutId = layout.id;
    this._originalLayout = JSON.stringify(layout);
    this.selectedItemId = null;
    this.isAddingNew = false;
    this.host.requestUpdate();
    this.navigation.updateHash();
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
    this.navigation.activeLayoutId = '';
    this._originalLayout = null; // No baseline for new layout
    this.selectedItemId = null;
    this.isAddingNew = true;
    this.host.requestUpdate();
    this.navigation.updateHash();
  }

  switchScene(scene: Scene) {
    this.selectScene(scene.id);
  }

  public selectScene(id: string | null) {
    this.navigation.selectScene(id);
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
    this.navigation.setSection(section);
  }

  public selectItem(itemId: string | null) {
    this.navigation.selectItem(itemId);
  }

  public selectImage(imageId: string | null) {
    this.navigation.selectImage(imageId);
  }

  public selectDisplayType(id: string | null) {
    this.navigation.selectDisplayType(id);
  }

  public setViewMode(mode: ViewMode) {
    this.navigation.setViewMode(mode);
  }

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
      this.activeScene = this.scenes[0];
    }
  }
}
