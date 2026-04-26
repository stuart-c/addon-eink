import { Scene } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the Scenes View.
 * Manages scene selection, layout preview highlights, and scene item configuration.
 */
export class ScenesViewController extends BaseViewController {
  public selectedItemId: string | null = null;
  public hoveredItemId: string | null = null;
  public selectedDisplayIds: string[] = [];
  private _originalSceneJson: string | null = null;

  get activeScene(): Scene | null {
    return this.state.activeScene;
  }

  get isDirty() {
    if (!this.activeScene || !this._originalSceneJson) return false;
    return JSON.stringify(this.activeScene) !== this._originalSceneJson;
  }

  get canDelete() {
    return !!this.activeScene;
  }

  public resetBaseline() {
    this._originalSceneJson = this.activeScene ? JSON.stringify(this.activeScene) : null;
    this.notifyDirty(false);
  }

  public async handleSelect(sceneId: string) {
    if (this.activeScene?.id === sceneId) return;

    const performSwitch = () => {
      const scene = this.state.scenes.find(s => s.id === sceneId);
      if (!scene) return;
      
      this.selectedDisplayIds = [];
      this.selectedItemId = null;
      this.state.switchScene(scene);
      this.resetBaseline();
      this.host.requestUpdate();
    };

    if (this.isDirty) {
      this.host.dispatchEvent(new CustomEvent('request-confirmation', {
        detail: {
          config: {
            title: 'Unsaved Changes',
            message: `You have unsaved changes to "${this.activeScene?.name}". What would you like to do?`,
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
              this.discard();
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
    if (!this.activeScene) return;
    await this.state.saveActiveScene();
    this.resetBaseline();
  }

  public discard() {
    if (!this._originalSceneJson) return;
    this.state.activeScene = JSON.parse(this._originalSceneJson);
    this.resetBaseline();
    this.host.requestUpdate();
  }

  public addNew() {
    // Handled via scene-dialog
  }

  public async requestDelete() {
    if (!this.activeScene) return;
    this.host.dispatchEvent(new CustomEvent('delete-scene', {
      detail: { scene: this.activeScene },
      bubbles: true,
      composed: true
    }));
  }

  public handleItemClick(id: string) {
    this.selectedItemId = id;
    this.host.requestUpdate();
  }

  public handleBoxClick(displayId: string) {
    const item = this.activeScene?.items?.find(i => i.displays?.includes(displayId));
    if (item) {
      this.selectedItemId = item.id;
      this.host.requestUpdate();
    }
  }

  public handleBoxHover(displayId: string) {
    const item = this.activeScene?.items?.find(i => i.displays?.includes(displayId));
    this.hoveredItemId = item ? item.id : null;
    this.host.requestUpdate();
  }

  public createSingleDisplayItems() {
    if (!this.activeScene || this.selectedDisplayIds.length === 0) return;

    const newItems = this.selectedDisplayIds.map(displayId => ({
      id: crypto.randomUUID(),
      type: 'image' as const,
      displays: [displayId],
      images: []
    }));

    const existingItems = this.activeScene.items || [];
    this.state.updateActiveScene({
      items: [...existingItems, ...newItems]
    });

    this.selectedDisplayIds = [];
    this.showMessage(`Added ${newItems.length} display item(s)`, 'success');
  }

  public createMultiDisplayItem() {
    if (!this.activeScene || this.selectedDisplayIds.length <= 1) return;

    const newItem = {
      id: crypto.randomUUID(),
      type: 'tile' as const,
      displays: [...this.selectedDisplayIds],
      images: []
    };

    const existingItems = this.activeScene.items || [];
    this.state.updateActiveScene({
      items: [...existingItems, newItem]
    });

    this.selectedDisplayIds = [];
    this.showMessage('Added multi-display tile item', 'success');
  }

  public deleteItem() {
    if (!this.activeScene || !this.selectedItemId) return;

    this.host.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: {
        config: {
          title: 'Delete Scene Item?',
          message: 'Are you sure you want to remove this item from the scene?',
          confirmText: 'Delete',
          type: 'danger'
        },
        callback: async (confirmed: boolean) => {
          if (confirmed) {
            const items = this.activeScene?.items?.filter(i => i.id !== this.selectedItemId) || [];
            this.state.updateActiveScene({ items });
            this.selectedItemId = null;
            this.showMessage('Scene item removed', 'success');
          }
        }
      },
      bubbles: true,
      composed: true
    }));
  }
}
