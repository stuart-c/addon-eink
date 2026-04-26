import { html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { api, Scene } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/section-layout';
import '../shared/empty-view';
import '../shared/sidebar-list';
import '../layout/layout-editor';
import '../layout/yaml-editor';
import '../dialogs/scene-dialog';
import { SceneDialog } from '../dialogs/scene-dialog';
import { SceneItemSettingsDialog } from '../dialogs/scene-item-settings-dialog';
import { ScenesViewController } from '../../controllers/ScenesViewController';
import { HaStateController } from '../../controllers/HaStateController';

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
        background: var(--bg-light);
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
        box-shadow: -1px 0 3px rgba(0,0,0,0.02);
        z-index: 2;
      }
      .pane-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        height: 48px;
        box-sizing: border-box;
      }
      .pane-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        height: 52px;
        box-sizing: border-box;
      }
      .pane-title {
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
      }
      .pane-toolbar {
        display: flex;
        gap: 0.5rem;
      }
      .content-list {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
      }
      .placeholder-item {
        padding: 10px 12px;
        min-height: 60px;
        box-sizing: border-box;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        background: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .placeholder-item:hover {
        border-color: var(--primary-colour);
        background: var(--bg-light);
      }
      .placeholder-item.selected {
        background: rgba(3, 169, 244, 0.08);
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      .placeholder-item.hovered {
        border-color: var(--primary-colour);
        background: var(--bg-light);
      }
      .placeholder-item-icon {
        color: var(--text-muted);
        font-size: 20px;
      }
      .selected .placeholder-item-icon {
        color: var(--primary-colour);
      }
      .placeholder-item-info {
        flex: 1;
      }
      .placeholder-item-name {
        font-weight: var(--font-weight-semi-bold);
        font-size: 13px;
        color: var(--text-colour);
        margin-bottom: 2px;
      }
      .placeholder-item-details {
        font-size: 11px;
        color: var(--text-muted);
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

      /* Pips Styles */
      .item-pips {
        display: flex;
        gap: 4px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed var(--border-colour-light);
        flex-wrap: wrap;
      }
      .pip {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--border-colour);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        position: relative;
      }
      .pip:hover {
        background: var(--text-muted);
        transform: scale(1.2);
      }
      .pip.selected {
        background: var(--primary-colour);
        box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.3);
        border-color: #fff;
      }
      .pip-tooltip {
        position: fixed;
        background: white;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        padding: 6px;
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -100%);
        margin-top: -10px;
      }
      .pip-tooltip img {
        width: 80px;
        height: 80px;
        object-fit: contain;
        background: var(--bg-light);
        border-radius: 2px;
      }
      .pip-tooltip span {
        font-size: 10px;
        font-weight: 600;
        color: var(--text-muted);
        white-space: nowrap;
      }

      /* Sidebar Filtering */
      .sidebar-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .sidebar-filter-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        background: white;
      }
      .filter-label {
        margin-bottom: 8px;
      }
    `
  ];

  @property({ type: Object }) state!: HaStateController;
  @property({ type: Array }) scenes: Scene[] = [];
  @property({ type: Object }) activeScene: Scene | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @state() private _existingSlices: any[] = [];
  @state() private _selectedPips: Record<string, string> = {}; // item_id -> image_id
  @state() private _hoveredPip: { itemId: string, imageId: string, x: number, y: number } | null = null;
  private _pollInterval: any = null;

  public controller = new ScenesViewController(this);
  @query('scene-dialog') private _sceneDialog!: SceneDialog;
  @query('scene-item-settings-dialog') private _itemSettingsDialog!: SceneItemSettingsDialog;
  
  connectedCallback() {
    super.connectedCallback();
    this._pollInterval = setInterval(() => this._fetchExistingSlices(), 5000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
    }
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('state')) {
      this.controller.resetBaseline();
    }
    
    // Sync layout filter with active scene ONLY when activeScene actually changes
    if (changedProperties.has('activeScene') && this.activeScene && this.activeScene.layout && this.state.sceneFilterLayoutId !== this.activeScene.layout) {
      this.state.sceneFilterLayoutId = this.activeScene.layout;
      this.state.refreshScenes({ layout: this.state.sceneFilterLayoutId });
    }
    }
    if (changedProperties.has('activeScene') || changedProperties.has('scenes')) {
      if (changedProperties.has('activeScene')) {
        this._fetchExistingSlices();
        this._selectedPips = {};
      }
    }
  }

  private async _fetchExistingSlices() {
    if (!this.activeScene) {
      this._existingSlices = [];
      return;
    }
    try {
      this._existingSlices = await api.getSceneSlices(this.activeScene.id);
    } catch (e) {
      console.error('Failed to fetch scene slices', e);
    }
  }

  public get isDirty() {
    return this.controller.isDirty;
  }

  public get canDelete() {
    return this.controller.canDelete;
  }

  public async save() {
    await this.controller.save();
  }

  public discard() {
    this.controller.discard();
  }

  public addNew() {
    this._sceneDialog.show(null, this.state.layouts);
  }

  public async requestDelete() {
    await this.controller.requestDelete();
  }

  private _handleItemDoubleClick(item: any) {
    const layout = this.state.layouts.find((l: any) => l.id === this.state.activeScene?.layout);
    if (!layout) return;

    this.controller.selectedItemId = item.id;
    this._itemSettingsDialog.show(item, layout, this.state.displayTypes);
  }

  private _handleEditItem(id?: string) {
    const itemId = id || this.controller.selectedItemId;
    if (!itemId) return;

    const item = this.state.activeScene?.items?.find((i: any) => i.id === itemId);
    const layout = this.state.layouts.find((l: any) => l.id === this.state.activeScene?.layout);
    
    if (item && layout) {
      this.controller.selectedItemId = itemId;
      this._itemSettingsDialog.show(item, layout, this.state.displayTypes);
    }
  }

  private _handleBoxEdit(displayId: string) {
    const item = this.state.activeScene?.items?.find((i: any) => i.displays?.includes(displayId));
    if (item) {
      this._handleEditItem(item.id);
    }
  }

  render() {
    const activeScene = this.state?.activeScene || this.activeScene;
    const activeLayout = activeScene ? this.state?.layouts.find((l: any) => l.id === activeScene.layout) : null;
    const scenes = (this.state?.scenes || this.scenes || []) as Scene[];
    const filteredScenes = this.state?.sceneFilterLayoutId
      ? scenes.filter(s => s.layout === this.state.sceneFilterLayoutId)
      : scenes;
    
    let usedDisplayIds: string[] = [];
    if (activeScene && activeScene.items) {
      activeScene.items.forEach((item: any) => {
        if (item.displays) {
          usedDisplayIds = [...usedDisplayIds, ...item.displays];
        }
      });
    }

    const highlightedItemId = this.controller.hoveredItemId || this.controller.selectedItemId;
    const highlightedDisplayIds = activeScene?.items?.find((i: any) => i.id === highlightedItemId)?.displays || [];

    // Calculate preview slices for layout editor
    const previewSlices: Record<string, string> = {};
    if (activeScene) {
      Object.entries(this._selectedPips).forEach(([itemId, imageId]) => {
        const item = activeScene.items?.find((i: any) => i.id === itemId);
        if (!item) return;
        
        item.displays?.forEach((dId: string) => {
          const slice = this._existingSlices.find(s => s.display_id === dId && s.image_id === imageId);
          if (slice) {
            previewSlices[dId] = `api/scene/${activeScene.id}/slice/${dId}/${imageId}?hash=${slice.file_hash}`;
          }
        });
      });
    }

    const listItems = filteredScenes.map(scene => {
      const isSelected = !!(activeScene && scene.id === activeScene.id);
      const displayData = isSelected ? activeScene! : scene;
      return {
        id: displayData.id,
        name: displayData.name,
        icon: 'landscape',
        status: displayData.status
      };
    });

    return html`
      <section-layout>
        <div slot="left-bar" class="sidebar-container">
          <div class="sidebar-filter-header">
            <label class="filter-label">Filter by Layout</label>
            <select 
              class="layout-select"
              @change="${(e: Event) => {
                this.state.sceneFilterLayoutId = (e.target as HTMLSelectElement).value;
                this.state.selectScene(null); // Clear active scene so we can browse the new layout
                this.state.refreshScenes({ layout: this.state.sceneFilterLayoutId });
              }}"
            >
              ${this.state?.layouts.map(l => html`
                <option value="${l.id}" ?selected="${this.state.sceneFilterLayoutId === l.id}">${l.name}</option>
              `)}
            </select>
          </div>
          <sidebar-list
            .items="${listItems}"
            .selectedId="${activeScene?.id || null}"
            @select="${(e: CustomEvent) => this.controller.handleSelect(e.detail.item.id)}"
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
            @data-update="${(e: CustomEvent) => {
              this.state.updateActiveScene(e.detail);
              this.controller.resetBaseline();
            }}"
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
                .selectedIds="${this.controller.selectedDisplayIds}"
                .highlightedIds="${highlightedDisplayIds}"
                .usedIds="${usedDisplayIds}"
                .previewSlices="${previewSlices}"
                @selection-change="${(e: CustomEvent) => { this.controller.selectedDisplayIds = e.detail.ids; this.requestUpdate(); }}"
                @box-click="${(e: CustomEvent) => this.controller.handleBoxClick(e.detail.id)}"
                @edit-item="${(e: CustomEvent) => this._handleBoxEdit(e.detail.id)}"
                @box-hover="${(e: CustomEvent) => this.controller.handleBoxHover(e.detail.id)}"
                @box-unhover="${() => { this.controller.hoveredItemId = null; this.requestUpdate(); }}"
              ></layout-editor>
            </div>
            
            <div class="content-pane">
              <div class="pane-header">
                <div class="pane-title">Scene Content</div>
                <div class="pane-toolbar">
                  <button 
                    class="secondary icon-button" 
                    title="New Single Display" 
                    ?disabled="${this.controller.selectedDisplayIds.length < 1}"
                    @click="${() => this.controller.createSingleDisplayItems()}"
                  >
                    <span class="material-icons">add_photo_alternate</span>
                  </button>
                  <button 
                    class="secondary icon-button" 
                    title="New Multi-Display (Tiled)"
                    ?disabled="${this.controller.selectedDisplayIds.length < 2}"
                    @click="${() => this.controller.createMultiDisplayItem()}"
                  >
                    <span class="material-icons">grid_view</span>
                  </button>
                </div>
              </div>
              
              <div class="content-list">
                ${activeScene.items?.map((item: any, index: number) => html`
                  <div 
                    class="placeholder-item ${this.controller.selectedItemId === item.id ? 'selected' : ''} ${this.controller.hoveredItemId === item.id ? 'hovered' : ''}"
                    @click="${() => this.controller.handleItemClick(item.id)}"
                    @dblclick="${() => this._handleItemDoubleClick(item)}"
                    @mouseenter="${() => { this.controller.hoveredItemId = item.id; this.requestUpdate(); }}"
                    @mouseleave="${() => { this.controller.hoveredItemId = null; this.requestUpdate(); }}"
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
                    
                    ${this._renderItemPips(item)}
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
                    class="secondary icon-button" 
                    title="Edit Item"
                    ?disabled="${!this.controller.selectedItemId}"
                    @click="${() => this._handleEditItem()}"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                  <button 
                    class="danger icon-button" 
                    title="Delete Item"
                    ?disabled="${!this.controller.selectedItemId}"
                    @click="${() => this.controller.deleteItem()}"
                  >
                    <span class="material-icons">delete</span>
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
        @delete="${() => this.controller.deleteItem()}"
        @save-item="${(e: CustomEvent) => {
          const items = this.activeScene?.items?.map((item: any) => 
            item.id === e.detail.item.id ? e.detail.item : item
          ) || [];
          this.state.updateActiveScene({ items });
          this.requestUpdate();
        }}"
      ></scene-item-settings-dialog>
      
      ${this._hoveredPip ? html`
        <div class="pip-tooltip" style="left: ${this._hoveredPip.x}px; top: ${this._hoveredPip.y}px;">
          <img src="api/image/${this._hoveredPip.imageId}/thumbnail" alt="thumbnail" />
          <span>${this.state.images.find(img => img.id === this._hoveredPip?.imageId)?.name || 'Unknown'}</span>
        </div>
      ` : ''}
    `;
  }

  private _renderItemPips(item: any) {
    if (!item.images || item.images.length === 0) return '';

    // An image is "available" if ALL its displays have a slice record
    const availableImages = item.images.filter((sceneImg: any) => {
      const imageId = sceneImg.image_id;
      const requiredDisplays = item.displays || [];
      const existingSlicesForImage = this._existingSlices.filter(s => s.image_id === imageId);
      
      return requiredDisplays.every((dId: string) => 
        existingSlicesForImage.some(s => s.display_id === dId)
      );
    });

    if (availableImages.length === 0) return '';

    return html`
      <div class="item-pips">
        ${availableImages.map((sceneImg: any) => {
          const imageId = sceneImg.image_id;
          const isSelected = this._selectedPips[item.id] === imageId;
          return html`
            <div 
              class="pip ${isSelected ? 'selected' : ''}"
              title="Click to preview dithered version"
              @click="${(e: Event) => {
                e.stopPropagation();
                this._togglePip(item.id, imageId);
              }}"
              @mouseenter="${(e: MouseEvent) => this._showPipTooltip(item.id, imageId, e)}"
              @mouseleave="${() => this._hoveredPip = null}"
            ></div>
          `;
        })}
      </div>
    `;
  }

  private _togglePip(itemId: string, imageId: string) {
    const current = this._selectedPips[itemId];
    if (current === imageId) {
      const newPips = { ...this._selectedPips };
      delete newPips[itemId];
      this._selectedPips = newPips;
    } else {
      this._selectedPips = { ...this._selectedPips, [itemId]: imageId };
    }
  }

  private _showPipTooltip(itemId: string, imageId: string, e: MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this._hoveredPip = {
      itemId,
      imageId,
      x: rect.left + rect.width / 2,
      y: rect.top
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scenes-view': ScenesView;
  }
}
