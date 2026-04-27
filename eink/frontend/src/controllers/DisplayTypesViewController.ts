import { DisplayType, api } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the Display Types View.
 * Manages display type selection, editing, and dirty state.
 */
export class DisplayTypesViewController extends BaseViewController {
  public editingItemId: string | null = null;
  public isAdding = false;
  private _originalTypesJson: string | null = null;
  private _localTypes: DisplayType[] = [];

  get displayTypes(): DisplayType[] {
    return this._localTypes.length > 0 ? this._localTypes : this.state.displayTypes;
  }

  get isDirty() {
    return JSON.stringify(this.displayTypes) !== this._originalTypesJson;
  }

  get activeType(): DisplayType | null {
    return this.displayTypes.find(t => t.id === this.editingItemId) || null;
  }

  get canDelete() {
    return !!this.activeType && !!this.activeType.id && !this.isAdding;
  }

  public hostConnected() {
    this.resetBaseline();
  }

  public resetBaseline() {
    this._localTypes = JSON.parse(JSON.stringify(this.state.displayTypes));
    this._originalTypesJson = JSON.stringify(this._localTypes);
    this.notifyDirty(false);
    this.notifyCanDelete(this.canDelete);
  }

  public selectType(id: string | null) {
    if (this.editingItemId === id) return;
    
    const performSelect = () => {
      this.editingItemId = id;
      this.isAdding = false;
      this.notifyCanDelete(this.canDelete);
      this.host.requestUpdate();
    };

    if (this.isDirty) {
      this.host.dispatchEvent(new CustomEvent('request-confirmation', {
        detail: {
          config: {
            title: 'Unsaved Changes',
            message: 'You have unsaved changes to display types. What would you like to do?',
            buttons: [
              { text: 'Save', value: 'save', type: 'primary' },
              { text: 'Discard', value: 'discard', type: 'danger' },
              { text: 'Cancel', value: 'cancel', type: 'secondary' }
            ]
          },
          callback: async (choice: string) => {
            if (choice === 'save') {
              await this.save();
              performSelect();
            } else if (choice === 'discard') {
              this.discard();
              performSelect();
            }
          }
        },
        bubbles: true,
        composed: true
      }));
    } else {
      performSelect();
    }
  }

  public async save() {
    try {
      // Save all modified types
      const savedIds = new Set<string>();
      const originalTypes = JSON.parse(this._originalTypesJson || '[]');
      
      for (const type of this._localTypes) {
        const original = originalTypes.find((t: any) => t.id === type.id);
        if (JSON.stringify(type) !== JSON.stringify(original)) {
          if (type.id.startsWith('new_')) {
            const { id: _, ...rest } = type;
            const result = await api.createItem<DisplayType>('display_type', rest);
            savedIds.add(result.id);
          } else {
            await api.updateItem<DisplayType>('display_type', type.id, type);
            savedIds.add(type.id);
          }
        }
      }
      
      await this.state.refresh();
      this.resetBaseline();
      if (this.editingItemId?.startsWith('new_')) {
         // Auto-select the first newly saved one if we were adding
         this.editingItemId = this.state.displayTypes[this.state.displayTypes.length -1].id;
      }
      this.notifyCanDelete(this.canDelete);
      this.showMessage(`Display type "${this.activeType?.name || ''}" saved!`, 'success');
    } catch (err: any) {
      this.showMessage(err.message || 'Failed to save display types', 'error');
    }
  }

  public discard() {
    this.resetBaseline();
    this.host.requestUpdate();
  }

  public addNew() {
    const newId = `new_${Math.random().toString(36).substr(2, 9)}`;
    const newType: DisplayType = {
      id: newId,
      name: 'New Display Type',
      width_mm: 200,
      height_mm: 150,
      width_px: 800,
      height_px: 600,
      panel_width_mm: 190,
      panel_height_mm: 140,
      colour_type: 'BW',
      frame: { colour: '#000000', border_width_mm: 5 },
      mat: { colour: '#ffffff' }
    };
    
    this._localTypes = [...this._localTypes, newType];
    this.editingItemId = newId;
    this.isAdding = true;
    this.notifyDirty(true);
    this.notifyCanDelete(this.canDelete);
    this.host.requestUpdate();
  }

  public updateActiveType(updates: Partial<DisplayType>) {
    if (!this.editingItemId) return;
    this._localTypes = this._localTypes.map(t => 
      t.id === this.editingItemId ? { ...t, ...updates } : t
    );
    this.notifyDirty(this.isDirty);
    this.host.requestUpdate();
  }

  public async requestDelete() {
    if (!this.activeType || this.isAdding) {
      if (this.isAdding) {
        this._localTypes = this._localTypes.filter(t => t.id !== this.editingItemId);
        this.editingItemId = null;
        this.isAdding = false;
        this.notifyDirty(this.isDirty);
        this.notifyCanDelete(this.canDelete);
        this.host.requestUpdate();
      }
      return;
    }

    this.host.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: {
        config: {
          title: 'Delete Display Type?',
          message: `Are you sure you want to delete "${this.activeType.name}"? This will fail if it's used in any layouts.`,
          confirmText: 'Delete',
          type: 'danger'
        },
        callback: async (confirmed: boolean) => {
          if (confirmed) {
            try {
              await api.deleteItem('display_type', this.activeType!.id);
              await this.state.refresh();
              this.resetBaseline();
              this.editingItemId = null;
              this.notifyCanDelete(this.canDelete);
              this.showMessage('Display type deleted', 'success');
            } catch (err: any) {
              this.showMessage(err.message || 'Failed to delete display type', 'error');
            }
          }
        }
      },
      bubbles: true,
      composed: true
    }));
  }
}
