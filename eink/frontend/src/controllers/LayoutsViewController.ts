import { Layout, DisplayType } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the Layouts View.
 * Manages layout selection, item arrangement, and dirty state.
 */
export class LayoutsViewController extends BaseViewController {
  public selectedItemId: string | null = null;
  public isAdding = false;
  public showDisplayMenu = false;
  private _originalLayoutJson: string | null = null;

  get activeLayout(): Layout | null {
    return this.state.activeLayout;
  }

  get isDirty() {
    if (!this.activeLayout) return false;
    return JSON.stringify(this.activeLayout) !== this._originalLayoutJson;
  }

  get canDelete() {
    return !!this.activeLayout && !!this.activeLayout.id;
  }

  public resetBaseline() {
    this._originalLayoutJson = this.activeLayout ? JSON.stringify(this.activeLayout) : null;
    this.notifyDirty(false);
  }

  public selectItem(id: string | null) {
    this.selectedItemId = id;
    this.state.selectItem(id);
    this.host.requestUpdate();
  }

  public async handleSelect(id: string) {
    if (this.activeLayout?.id === id) return;

    const performSwitch = () => {
      const layout = this.state.layouts.find(l => l.id === id);
      if (!layout) return;
      this.state.switchLayout(layout);
      this.resetBaseline();
      this.host.requestUpdate();
    };

    if (this.isDirty) {
      this.host.dispatchEvent(new CustomEvent('request-confirmation', {
        detail: {
          config: {
            title: 'Unsaved Changes',
            message: `You have unsaved changes to "${this.activeLayout?.name}". What would you like to do?`,
            buttons: [
              { text: 'Save', value: 'save', type: 'primary' },
              { text: 'Discard', value: 'discard', type: 'danger' },
              { text: 'Cancel', value: 'cancel', type: 'secondary' }
            ]
          },
          callback: async (choice: string) => {
            if (choice === 'save') {
              await this.save();
              performSwitch();
            } else if (choice === 'discard') {
              await this.discard();
              performSwitch();
            }
          }
        },
        bubbles: true,
        composed: true
      }));
    } else {
      performSwitch();
    }
  }

  public async save() {
    if (!this.activeLayout) return;
    await this.state.saveActiveLayout();
    this.resetBaseline();
  }

  public async discard() {
    if (this._originalLayoutJson) {
      this.state.activeLayout = JSON.parse(this._originalLayoutJson);
      this.resetBaseline();
      this.host.requestUpdate();
    }
  }

  public async addNew() {
    this.state.prepareNewLayout();
    this.host.requestUpdate();
  }

  public requestDelete() {
    if (!this.activeLayout) return;
    this.host.dispatchEvent(new CustomEvent('delete-layout', {
      detail: { layout: this.activeLayout },
      bubbles: true,
      composed: true
    }));
  }

  public addItemToLayout(dt: DisplayType) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: dt.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 'landscape' as 'landscape' | 'portrait'
    };
    
    if (this.activeLayout) {
      const items = [...(this.activeLayout.items || []), newItem];
      this.state.updateActiveLayout({ items });
      this.selectItem(id);
    }
    this.showDisplayMenu = false;
    this.host.requestUpdate();
  }

  public updateItem(id: string, updates: any) {
    this.state.updateItem(id, updates);
    this.notifyDirty(this.isDirty);
  }

  public checkDirty() {
    this.notifyDirty(this.isDirty);
  }
}
