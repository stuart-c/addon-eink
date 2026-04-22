import { html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { Scene } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/section-layout';
import '../shared/empty-view';
import '../shared/sidebar-list';
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
export class ScenesView extends BaseResourceView {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
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
        width: 340px;
        background: white;
        border-left: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: -2px 0 10px rgba(0,0,0,0.02);
        z-index: 2;
      }
      .pane-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
      }
      .pane-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
        gap: 0.5rem;
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
        padding: 12px;
        min-height: 64px;
        box-sizing: border-box;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #fff;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .placeholder-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
      }
      .placeholder-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      .placeholder-item.hovered {
        border-color: var(--primary-colour);
        background: #f0faff;
      }
      .placeholder-item-icon {
        color: #888;
      }
      .selected .placeholder-item-icon {
        color: var(--primary-colour);
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

      .scene-settings-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 50%;
        background: var(--bg-light);
        border: 1px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        color: var(--text-muted);
      }
      .scene-settings-btn:hover {
        background: #fff;
        color: var(--primary-colour);
        border-color: var(--primary-colour);
        box-shadow: var(--shadow-small);
      }
    `
  ];

  @property({ type: Array }) scenes: Scene[] = [];
  @property({ type: Object }) activeScene: Scene | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @state() private _selectedDisplayIds: string[] = [];
  @state() private _selectedItemId: string | null = null;
  @state() private _hoveredItemId: string | null = null;
  @query('scene-dialog') private _sceneDialog!: SceneDialog;
  @query('scene-item-settings-dialog') private _itemSettingsDialog!: SceneItemSettingsDialog;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('activeScene')) {
      this.notifyCanDelete(!!this.activeScene);
      this.notifyDirty(false);
      this._selectedItemId = null;
    }
  }

  public save() {
    // Scenes are currently auto-saved or saved via dialog
  }

  public discard() {
    // No inline discard for scenes currently
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

  private _handleSelect(sceneId: string) {
    const scene = this.state.scenes.find((s: any) => s.id === sceneId);
    if (!scene) return;
    
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

  private _handleBoxClick(displayId: string) {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene) return;

    const item = activeScene.items?.find((i: any) => i.displays?.includes(displayId));
    if (item) {
      this._selectedItemId = item.id;
    }
  }

  private _handleBoxHover(displayId: string) {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene) return;

    const item = activeScene.items?.find((i: any) => i.displays?.includes(displayId));
    this._hoveredItemId = item ? item.id : null;
  }

  private _handleItemDoubleClick(item: any) {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene) return;
    
    const layout = this.state.layouts.find((l: any) => l.id === activeScene.layout);
    if (!layout) return;

    this._selectedItemId = item.id;
    this._itemSettingsDialog.show(item, layout, this.state.displayTypes);
  }

  private _handleEditItem(id?: string) {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene) return;
    
    const itemId = id || this._selectedItemId;
    if (!itemId) return;

    const item = activeScene.items?.find((i: any) => i.id === itemId);
    const layout = this.state.layouts.find((l: any) => l.id === activeScene.layout);
    
    if (item && layout) {
      this._selectedItemId = itemId;
      this._itemSettingsDialog.show(item, layout, this.state.displayTypes);
    }
  }

  private _handleBoxEdit(displayId: string) {
    const activeScene = this.state?.activeScene || this.activeScene;
    if (!activeScene) return;

    const item = activeScene.items?.find((i: any) => i.displays?.includes(displayId));
    if (item) {
      this._handleEditItem(item.id);
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
    this.showMessage(`Added ${newItems.length} display item(s)`, 'success');
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
    this.showMessage('Added multi-display tile item', 'success');
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
          this.showMessage('Scene item removed', 'success');
        }
      }
    );
  }

  render() {
    const scenes = (this.state?.scenes || this.scenes || []) as Scene[];
    const activeScene = this.state?.activeScene || this.activeScene;
    const activeLayout = activeScene ? this.state?.layouts.find((l: any) => l.id === activeScene.layout) : null;
    
    let usedDisplayIds: string[] = [];
    if (activeScene && activeScene.items) {
      activeScene.items.forEach((item: any) => {
        if (item.displays) {
          usedDisplayIds = [...usedDisplayIds, ...item.displays];
        }
      });
    }

    const highlightedItemId = this._hoveredItemId || this._selectedItemId;
    const highlightedDisplayIds = activeScene?.items?.find((i: any) => i.id === highlightedItemId)?.displays || [];

    const listItems = scenes.map(scene => ({
      id: scene.id,
      name: scene.name,
      icon: 'landscape',
      status: scene.status
    }));

    return html`
      <section-layout>
        <div slot="left-bar">
          <sidebar-list
            .items="${listItems}"
            .selectedId="${activeScene?.id || null}"
            @select="${(e: CustomEvent) => this._handleSelect(e.detail.item.id)}"
          ></sidebar-list>
        </div>

        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${activeScene ? html`
              ${activeScene.name}
              <span class="status-badge ${activeScene.status}" style="margin-left: 8px;">${activeScene.status}</span>
            ` : 'Smart Scenes'}
          </div>
          <div class="toolbar-actions">
            ${activeScene ? html`
              <button class="secondary" @click="${() => this._sceneDialog.show(activeScene)}" title="Scene Settings">
                <span class="material-icons">settings</span>
              </button>
            ` : ''}
          </div>
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
                .highlightedIds="${highlightedDisplayIds}"
                .usedIds="${usedDisplayIds}"
                @selection-change="${(e: CustomEvent) => this._selectedDisplayIds = e.detail.ids}"
                @box-click="${(e: CustomEvent) => this._handleBoxClick(e.detail.id)}"
                @edit-item="${(e: CustomEvent) => this._handleBoxEdit(e.detail.id)}"
                @box-hover="${(e: CustomEvent) => this._handleBoxHover(e.detail.id)}"
                @box-unhover="${() => this._hoveredItemId = null}"
              ></layout-editor>
            </div>
            
            <div class="content-pane">
              <div class="pane-header">
                <div class="pane-title">Scene Content</div>
                <div class="pane-toolbar">
                  <button 
                    class="secondary" 
                    title="New Single Display" 
                    ?disabled="${this._selectedDisplayIds.length < 1}"
                    @click="${() => this._handleCreateSingleDisplayItems()}"
                  >
                    <span class="material-icons" style="font-size: 18px;">add_photo_alternate</span>
                  </button>
                  <button 
                    class="secondary" 
                    title="New Multi-Display (Tiled)"
                    ?disabled="${this._selectedDisplayIds.length < 2}"
                    @click="${() => this._handleCreateMultiDisplayItem()}"
                  >
                    <span class="material-icons" style="font-size: 18px;">grid_view</span>
                  </button>
                </div>
              </div>
              
              <div class="content-list">
                ${activeScene.items?.map((item: any, index: number) => html`
                  <div 
                    class="placeholder-item ${this._selectedItemId === item.id ? 'selected' : ''} ${this._hoveredItemId === item.id ? 'hovered' : ''}"
                    @click="${() => this._handleItemClick(item.id)}"
                    @dblclick="${() => this._handleItemDoubleClick(item)}"
                    @mouseenter="${() => this._hoveredItemId = item.id}"
                    @mouseleave="${() => this._hoveredItemId = null}"
                  >
                    <div class="placeholder-item-icon">
                      <span class="material-icons">
                        ${item.type === 'image' ? 'image' : 'grid_on'}
                      </span>
                    </div>
                    <div class="placeholder-item-info">
                      <div class="placeholder-item-name">Scene Item #${index + 1}</div>
                      <div class="placeholder-item-details">
                        Displays: ${(item.displays || []).map((id: string) => {
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
                    <span>No scene items. Select displays in the layout and click the add buttons to add them.</span>
                  </div>
                ` : ''}
              </div>

              <div class="pane-footer">
                <div class="toolbar-actions">
                  <button 
                    class="secondary" 
                    title="Edit Item"
                    ?disabled="${!this._selectedItemId}"
                    @click="${() => this._handleEditItem()}"
                  >
                    <span class="material-icons" style="font-size: 18px;">edit</span>
                  </button>
                  <button 
                    class="danger" 
                    title="Delete Item"
                    ?disabled="${!this._selectedItemId}"
                    @click="${() => this._handleDeleteItem()}"
                  >
                    <span class="material-icons" style="font-size: 18px;">delete</span>
                  </button>
                </div>
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
      <scene-item-settings-dialog
        @delete="${() => this._handleDeleteItem()}"
      ></scene-item-settings-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scenes-view': ScenesView;
  }
}
