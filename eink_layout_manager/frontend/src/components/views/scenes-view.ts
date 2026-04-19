import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { Scene } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/section-layout';
import '../shared/empty-view';
import '../layout/layout-editor';
import '../layout/yaml-editor';
import '../dialogs/scene-dialog';
import { SceneDialog } from '../dialogs/scene-dialog';
import '../dialogs/scene-item-settings-dialog';
import { SceneItemSettingsDialog } from '../dialogs/scene-item-settings-dialog';

/**
 * A view component for managing Smart Scenes.
 */
@customElement('scenes-view')
export class ScenesView extends LitElement {
  @property({ type: Object }) state!: any;
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .scenes-sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .sidebar-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
      }
      .sidebar-item {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .sidebar-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
      }
      .sidebar-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      .sidebar-item-icon {
        color: #888;
      }
      .sidebar-item.selected .sidebar-item-icon {
        color: var(--primary-colour);
      }
      .sidebar-item-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-colour);
      }
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        width: 100%;
      }
      .toolbar-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .settings-button {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }
      .settings-button:hover {
        background: #e4e6e9;
        border-color: #ccc;
        color: #333;
      }
      .settings-button .material-icons {
        font-size: 20px;
      }
      
      /* Scene Workspace Layout */
      .workspace {
        display: flex;
        height: 100%;
        width: 100%;
        background: #f0f2f5;
        overflow: hidden;
      }
      .preview-pane {
        flex: 1;
        min-width: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .content-pane {
        width: 320px;
        background: white;
        border-left: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: -2px 0 10px rgba(0,0,0,0.02);
        z-index: 2;
      }
      .pane-header {
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
      }
      .pane-title {
        font-weight: 800;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-muted);
      }
      .pane-toolbar {
        display: flex;
        gap: 0.4rem;
      }
      .tool-button {
        width: 34px;
        height: 34px;
        padding: 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid #efefef;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        color: #555;
      }
      .tool-button:hover:not(:disabled) {
        background: var(--bg-light);
        border-color: var(--primary-colour);
        color: var(--primary-colour);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(3, 169, 244, 0.15);
      }
      .tool-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        background: #f5f5f5;
        border-color: #eee;
      }
      .tool-button .material-icons {
        font-size: 18px;
      }
      .content-list {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem 1rem;
      }
      .placeholder-item {
        padding: 1rem;
        border: 1px solid #f0f0f0;
        border-radius: 12px;
        margin-bottom: 1rem;
        background: white;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid #f0f0f0;
        cursor: default;
      }
      .placeholder-item:hover {
        border-color: #e0e0e0;
        border-left-color: var(--primary-colour);
        box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        transform: translateX(4px);
      }
      .placeholder-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        border-left-color: var(--primary-colour);
        box-shadow: 0 4px 12px rgba(3, 169, 244, 0.1);
      }
      .placeholder-item-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #aaa;
      }
      .placeholder-item-info {
        flex: 1;
      }
      .placeholder-item-name {
        font-weight: 700;
        font-size: 13px;
        color: var(--text-colour);
        margin-bottom: 3px;
      }
      .placeholder-item-details {
        font-size: 11px;
        color: #999;
        font-weight: 500;
      }
      .empty-content-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #bbb;
        text-align: center;
        gap: 1rem;
      }
      .empty-content-state .material-icons {
        font-size: 48px;
        opacity: 0.3;
      }
      .empty-content-state span {
        font-size: 13px;
        font-weight: 500;
      }
    `
  ];

  @property({ type: Array }) scenes: Scene[] = [];
  @property({ type: Object }) activeScene: Scene | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @state() private _selectedDisplayIds: string[] = [];
  @state() private _selectedItemId: string | null = null;
  @query('scene-dialog') private _sceneDialog!: SceneDialog;
  @query('scene-item-settings-dialog') private _itemSettingsDialog!: SceneItemSettingsDialog;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('activeScene')) {
      this.dispatchEvent(new CustomEvent('can-delete-change', {
        detail: { canDelete: !!this.activeScene },
        bubbles: true,
        composed: true
      }));
      this.dispatchEvent(new CustomEvent('dirty-state-change', {
        detail: { isDirty: false },
        bubbles: true,
        composed: true
      }));
      this._selectedItemId = null;
    }
  }

  public addNew() {
    this._sceneDialog.show();
  }

  public async requestDelete() {
    if (!this.activeScene) return;
    this.dispatchEvent(new CustomEvent('delete-scene', {
      detail: { scene: this.activeScene },
      bubbles: true,
      composed: true
    }));
  }

  get isDirty() { return false; }
  get canDelete() { return !!this.activeScene; }

  private _handleSelect(scene: Scene) {
    this._selectedDisplayIds = [];
    this._selectedItemId = null;
    this.dispatchEvent(new CustomEvent('select-scene', {
      detail: { scene },
      bubbles: true,
      composed: true
    }));
  }

  private _handleItemClick(id: string) {
    this._selectedItemId = id;
  }

  private _handleItemDoubleClick(item: any) {
    this._selectedItemId = item.id;
    this._itemSettingsDialog.show(item);
  }

  private _handleEditItem() {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene || !this._selectedItemId) return;
    
    const item = activeScene.items?.find((i: any) => i.id === this._selectedItemId);
    if (item) {
      this._itemSettingsDialog.show(item);
    }
  }

  private async _handleCreateSingleDisplayItems() {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene || this._selectedDisplayIds.length === 0) return;

    const newItems = this._selectedDisplayIds.map(displayId => ({
      id: crypto.randomUUID(),
      type: 'image' as const,
      displays: [displayId],
      images: []
    }));

    const existingItems = activeScene.items || [];
    await this.state.updateScene(activeScene.id, {
      items: [...existingItems, ...newItems]
    });

    this._selectedDisplayIds = [];
    this.state.showMessage(`Added ${newItems.length} display item(s)`, 'success');
  }

  private async _handleCreateMultiDisplayItem() {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene || this._selectedDisplayIds.length <= 1) return;

    const newItem = {
      id: crypto.randomUUID(),
      type: 'tile' as const,
      displays: [...this._selectedDisplayIds],
      images: []
    };

    const existingItems = activeScene.items || [];
    await this.state.updateScene(activeScene.id, {
      items: [...existingItems, newItem]
    });

    this._selectedDisplayIds = [];
    this.state.showMessage('Added multi-display tile item', 'success');
  }

  private _handleDeleteItem() {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene || !this._selectedItemId) return;

    this._requestConfirmation(
      {
        title: 'Delete Scene Item?',
        message: 'Are you sure you want to remove this item from the scene?',
        confirmText: 'Delete',
        type: 'danger'
      },
      async (confirmed: boolean) => {
        if (confirmed) {
          const items = activeScene.items?.filter((i: any) => i.id !== this._selectedItemId) || [];
          await this.state.updateScene(activeScene.id, { items });
          this._selectedItemId = null;
          this.state.showMessage('Scene item removed', 'success');
        }
      }
    );
  }

  private _requestConfirmation(
    config: any,
    callback: (result: boolean) => void
  ) {
    this.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: { config, callback },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const scenes = (this.state?.scenes || this.scenes || []) as Scene[];
    const activeScene = this.state?.activeScene || this.activeScene;
    const activeLayout = activeScene ? this.state?.layouts.find((l: any) => l.id === activeScene.layout) : null;

    return html`
      <section-layout>
        <div slot="left-bar" class="scenes-sidebar">
          <div class="sidebar-items">
            ${scenes.map(scene => html`
              <div 
                class="sidebar-item ${activeScene?.id === scene.id ? 'selected' : ''}" 
                @click="${() => this._handleSelect(scene)}"
              >
                <span class="material-icons sidebar-item-icon">landscape</span>
                <span class="sidebar-item-name">${scene.name}</span>
              </div>
            `)}
            ${scenes.length === 0 ? html`
              <div style="padding: 1rem; color: #666; font-size: 14px; text-align: center;">
                No scenes found.
              </div>
            ` : ''}
          </div>
        </div>

        <div slot="right-top-bar" class="toolbar">
          ${activeScene ? html`
            <button id="btn-scene-settings" class="settings-button" @click="${() => this._sceneDialog.show(activeScene)}" title="Scene Settings">
              <span class="material-icons">settings</span>
            </button>
            <div class="toolbar-title">
              <span>${activeScene.name}</span>
            </div>
          ` : html`
            <div class="toolbar-title">Smart Scenes Toolbar</div>
          `}
        </div>

        ${this.viewMode === 'yaml' && activeScene ? html`
          <yaml-editor
            slot="right-main"
            .data="${activeScene}"
            .schemaName="Scene"
            @data-update="${(e: CustomEvent) => this.state.updateScene(activeScene.id, e.detail)}"
          ></yaml-editor>
        ` : (activeScene && activeLayout ? html`
          <div slot="right-main" class="workspace">
            <div class="preview-pane">
              <layout-editor
                .width_mm="${activeLayout.canvas_width_mm}"
                .height_mm="${activeLayout.canvas_height_mm}"
                .items="${activeLayout.items}"
                .displayTypes="${this.state.displayTypes}"
                .readOnly="${true}"
                .selectedIds="${this._selectedDisplayIds}"
                @selection-change="${(e: CustomEvent) => this._selectedDisplayIds = e.detail.ids}"
              ></layout-editor>
            </div>
            
            <div class="content-pane">
              <div class="pane-header">
                <div class="pane-title">Scene Content</div>
                <div class="pane-toolbar">
                  <button 
                    class="tool-button" 
                    title="New Single Display" 
                    ?disabled="${this._selectedDisplayIds.length < 1}"
                    @click="${this._handleCreateSingleDisplayItems}"
                  >
                    <span class="material-icons">add_photo_alternate</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="New Multi-Display (Tiled)"
                    ?disabled="${this._selectedDisplayIds.length < 2}"
                    @click="${this._handleCreateMultiDisplayItem}"
                  >
                    <span class="material-icons">grid_view</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="Edit Item"
                    ?disabled="${!this._selectedItemId}"
                    @click="${this._handleEditItem}"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                  <button 
                    class="tool-button" 
                    title="Delete Item"
                    ?disabled="${!this._selectedItemId}"
                    @click="${this._handleDeleteItem}"
                  >
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
              
              <div class="content-list">
                ${activeScene.items?.map((item: any, index: number) => html`
                  <div 
                    class="placeholder-item ${this._selectedItemId === item.id ? 'selected' : ''}"
                    @click="${() => this._handleItemClick(item.id)}"
                    @dblclick="${() => this._handleItemDoubleClick(item)}"
                  >
                    <div class="placeholder-item-icon">
                      <span class="material-icons">
                        ${item.type === 'image' ? 'image' : 'grid_on'}
                      </span>
                    </div>
                    <div class="placeholder-item-info">
                      <div class="placeholder-item-name">Scene Item #${index + 1}</div>
                      <div class="placeholder-item-details">
                        Displays: ${item.displays.map((id: string) => {
                          const layoutItem = activeLayout.items.find((li: any) => li.id === id);
                          const dt = this.state.displayTypes.find((t: any) => t.id === layoutItem?.display_type_id);
                          return dt?.name || id;
                        }).join(', ')} • ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                    </div>
                  </div>
                `)}
                
                ${(!activeScene.items || activeScene.items.length === 0) ? html`
                  <div class="empty-content-state">
                    <span class="material-icons">post_add</span>
                    <span>No scene items. Select displays in the layout and click "+" to add them.</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        ` : html`
          <empty-view 
            slot="right-main"
            title="Smart Scenes"
            icon="landscape"
            message="${activeScene ? (activeLayout ? '' : `Layout for "${activeScene.name}" not found.`) : 'Compose complex scenes by combining layouts, images and live data.'}"
          ></empty-view>
        `)}
      </section-layout>
      <scene-dialog 
        .layouts="${this.state?.layouts || []}"
        @create="${(e: CustomEvent) => this.state.createScene(e.detail.name, e.detail.layout)}"
        @save="${(e: CustomEvent) => this.state.updateScene(e.detail.id, { name: e.detail.name, layout: e.detail.layout })}"
      ></scene-dialog>
      <scene-item-settings-dialog></scene-item-settings-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scenes-view': ScenesView;
  }
}
