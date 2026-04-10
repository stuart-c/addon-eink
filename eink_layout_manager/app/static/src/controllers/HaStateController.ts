import { ReactiveController, ReactiveControllerHost } from 'lit';
import { api, DisplayType, Layout, LayoutItem } from '../services/HaApiClient';

/**
 * A Lit Reactive Controller to manage the application state:
 * - Layouts collection
 * - Display Types collection
 * - Active Layout selection
 * - Backend connectivity
 */
export class HaStateController implements ReactiveController {
  public connected = false;
  public displayTypes: DisplayType[] = [];
  public layouts: Layout[] = [];
  public activeLayout: Layout | null = null;
  public selectedItemId: string | null = null;
  public activeSection: 'display-types' | 'layouts' | 'images' | 'scenes' = 'layouts';
  public message = '';
  public isSaving = false;

  constructor(private host: ReactiveControllerHost) {
    this.host.addController(this);
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
      
      if (this.layouts.length > 0) {
        if (!this.activeLayout) {
          this.activeLayout = this.layouts[0];
        } else {
          const fresh = this.layouts.find(l => l.id === this.activeLayout?.id);
          if (fresh) this.activeLayout = fresh;
        }
      } else {
        await this.createDefaultLayout();
      }
      this.host.requestUpdate();
    } catch (e: any) {
      console.error('Fetch failed', e);
      this.showMessage(`Fetch failed: ${e.message}`, 'error');
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
    await api.createItem('layout', defaultLayout);
  }

  async saveActiveLayout() {
    if (!this.activeLayout) return;
    
    this.isSaving = true;
    this.host.requestUpdate();
    
    try {
      await api.updateItem('layout', this.activeLayout.id, this.activeLayout);
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

  showMessage(text: string, type: 'info' | 'success' | 'error' = 'info') {
    this.message = text;
    this.host.requestUpdate();
    setTimeout(() => {
      this.message = '';
      this.host.requestUpdate();
    }, 3000);
  }

  switchLayout(layout: Layout) {
    this.activeLayout = layout;
    this.selectedItemId = null;
    this.host.requestUpdate();
  }
  
  setSection(section: 'display-types' | 'layouts' | 'images' | 'scenes') {
    this.activeSection = section;
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
}
