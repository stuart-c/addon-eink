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
  public activeSection: AppSection = 'layouts';
  public message: string = '';
  private _originalLayout: string | null = null;
  public isSaving = false;

  constructor(private host: ReactiveControllerHost) {
    this.host.addController(this);
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
  }
}
