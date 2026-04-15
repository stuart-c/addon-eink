import { ReactiveController, ReactiveControllerHost } from 'lit';
import { api, DisplayType, Layout, LayoutItem, Image, Scene } from '../services/HaApiClient';

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
  public activeLayout: Layout | null = null;
  public activeScene: Scene | null = null;
  public selectedItemId: string | null = null;
  public selectedImageId: string | null = null;
  public selectedDisplayTypeId: string | null = null;
  public activeSection: AppSection = 'layouts';
  public message: string = '';
  private _originalLayout: string | null = null;
  public isSaving = false;
  public viewMode: ViewMode = 'graphical';

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
    if (!this.connected) return;

    try {
      this.displayTypes = await api.getCollection<DisplayType>('display_type');
      this.layouts = await api.getCollection<Layout>('layout');
      this.images = await api.getImages();
      this.scenes = await api.getCollection<Scene>('scene');
      
      if (this.layouts.length > 0) {
        if (!this.activeLayout) {
          this.activeLayout = this.layouts[0];
        } else {
          const fresh = this.layouts.find(l => l.id === this.activeLayout?.id);
          if (fresh) this.activeLayout = fresh;
        }
        this._originalLayout = JSON.stringify(this.activeLayout);
      } else {
        await this.createDefaultLayout();
      }
      this.host.requestUpdate();
      this._applyHash();
    } catch (e: any) {
      console.error('Fetch failed', e);
      this.showMessage(`Fetch failed: ${e.message}`, 'error');
    }
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
    const defaultLayout: Layout = {
      id: 'default',
      name: 'Main Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    this.activeLayout = defaultLayout;
    this.layouts = [defaultLayout];
    this._originalLayout = JSON.stringify(defaultLayout);
    await api.createItem('layout', defaultLayout);
  }

  async saveActiveLayout() {
    if (!this.activeLayout) return;
    
    this.isSaving = true;
    this.host.requestUpdate();
    
    try {
      await api.updateItem('layout', this.activeLayout.id, this.activeLayout);
      this._originalLayout = JSON.stringify(this.activeLayout);
      this.showMessage('Layout saved!', 'success');
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
      const exists = this.displayTypes.some(existing => existing.id === dt.id);
      if (exists) {
        await api.updateItem('display_type', dt.id, dt);
      } else {
        await api.createItem('display_type', dt);
      }
      this.showMessage(`Display type "${dt.name}" saved!`, 'success');
      await this.refresh();
      this._updateHash();
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
      await api.deleteItem('display_type', dt.id);
      await this.refresh();
      this.showMessage(`Display type "${dt.name}" deleted.`, 'success');
      if (this.selectedDisplayTypeId === dt.id) {
        this.selectedDisplayTypeId = null;
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
      await api.deleteItem('layout', layout.id);
      if (this.activeLayout?.id === layout.id) {
        this.activeLayout = null;
        this._originalLayout = null;
      }
      await this.refresh();
      this.showMessage(`Layout "${layout.name}" deleted.`, 'success');
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
      const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const newScene: Scene = { id, name, layout };
      const result = await api.createItem<Scene>('scene', newScene);
      await this.refresh();
      this.activeScene = this.scenes.find(s => s.id === result.id) || result;
      this.showMessage(`Scene "${name}" created!`, 'success');
      this._updateHash();
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
      await api.updateItem('scene', id, updates);
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

  async deleteScene(scene: Scene): Promise<boolean> {
    try {
      await api.deleteItem('scene', scene.id);
      if (this.activeScene?.id === scene.id) {
        this.activeScene = null;
      }
      await this.refresh();
      this.showMessage(`Scene "${scene.name}" deleted.`, 'success');
      this._updateHash();
      return true;
    } catch (e: any) {
      this.showMessage(`Failed to delete scene: ${e.message}`, 'error');
      return false;
    }
  }

  showMessage(text: string, _type: 'info' | 'success' | 'error' = 'info') {
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
    Object.assign(this.activeLayout, updates);
    this.host.requestUpdate();
  }

  updateItem(itemId: string, updates: Partial<LayoutItem>) {
    if (!this.activeLayout) return;
    const item = this.activeLayout.items.find(i => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.activeLayout.items = [...this.activeLayout.items];
      this.host.requestUpdate();
    }
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
      if (this.activeSection !== section) this.activeSection = section;
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
      if (this.selectedDisplayTypeId !== displayTypeId) this.selectedDisplayTypeId = displayTypeId;
    }

    this.host.requestUpdate();
  }
}
