import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { Layout, DisplayType } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/empty-view';
import '../shared/section-layout';
import '../layout/layout-editor';
import '../layout/yaml-editor';
import '../dialogs/layout-settings-dialog';
import { LayoutSettingsDialog } from '../dialogs/layout-settings-dialog';

/**
 * A view component for managing Canvas Layouts.
 */
@customElement('layouts-view')
export class LayoutsView extends BaseResourceView {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      
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
      
      .content-list {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
      }
      
      .layout-item-card {
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
      
      .layout-item-card:hover {
        border-color: var(--primary-colour);
        background: var(--bg-light);
      }
      
      .layout-item-card.selected {
        background: rgba(3, 169, 244, 0.08);
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      
      .item-icon {
        color: var(--text-muted);
        font-size: 20px;
      }
      
      .layout-item-card.selected .item-icon {
        color: var(--primary-colour);
      }
      
      .item-info {
        flex: 1;
        min-width: 0;
      }
      
      .item-name {
        font-weight: var(--font-weight-semi-bold);
        font-size: 13px;
        color: var(--text-colour);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .item-meta {
        font-size: 11px;
        color: var(--text-muted);
        display: block;
        margin-top: 2px;
        font-weight: 500;
      }

      .pane-toolbar {
        display: flex;
        gap: 0.25rem;
      }


      .dropdown {
        position: relative;
        display: inline-block;
      }
      
      .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        min-width: 260px;
        box-shadow: var(--shadow-medium);
        border: 1px solid var(--border-colour);
        border-radius: 8px;
        margin-top: 0.5rem;
        z-index: 100;
        overflow: hidden;
        display: none;
      }
      .dropdown-menu.show {
        display: block;
        animation: slideIn 0.2s ease;
      }

      .display-type-item {
        padding: 10px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.2s;
        border-bottom: 1px solid var(--border-colour-light);
      }
      .display-type-item:last-child { border-bottom: none; }
      .display-type-item:hover { background: var(--bg-light); color: var(--primary-colour); }
      
      .display-type-info {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
      }
      .display-type-name {
        font-weight: 600;
        font-size: 13px;
        color: var(--text-colour);
      }
      .display-type-meta {
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 500;
      }

      @keyframes slideIn {
        from { transform: translateY(-8px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

    `
  ];

  @property({ type: Array }) layouts: Layout[] = [];
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: String }) selectedItemId: string | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @property({ type: Boolean }) isSaving = false;
  @property({ type: Boolean }) isAdding = false;

  @state() private _originalLayoutJson: string | null = null;
  @state() private _showDisplayMenu = false;
  @query('layout-settings-dialog') private _layoutSettingsDialog!: LayoutSettingsDialog;

  private _handleGlobalClick = (e: MouseEvent) => {
    if (!this._showDisplayMenu) return;
    const path = e.composedPath();
    const isDropdown = path.some(el => (el as HTMLElement).classList?.contains('dropdown'));
    if (!isDropdown) {
      this._showDisplayMenu = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this._handleGlobalClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this._handleGlobalClick);
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('activeLayout')) {
      const oldLayout = changedProperties.get('activeLayout') as Layout | null;
      // Only reset baseline if ID changed or we have no baseline yet
      if (!this._originalLayoutJson || !oldLayout || (this.activeLayout && oldLayout.id !== this.activeLayout.id)) {
        this.resetBaseline();
      }
      this.notifyDirty(this.isDirty);
      this.notifyCanDelete(!!this.activeLayout && !!this.activeLayout.id);
    }
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

  private _onSelectionChange(e: CustomEvent) {
    this.dispatchEvent(new CustomEvent('select-item', { detail: { id: e.detail.ids[0] || null } }));
  }

  private _onItemUpdate(id: string, updates: any) {
    this.dispatchEvent(new CustomEvent('update-item', { detail: { id, updates } }));
    this._checkDirty();
  }

  private _checkDirty() {
    this.notifyDirty(this.isDirty);
  }

  public async save() {
    this.dispatchEvent(new CustomEvent('save-layout'));
  }

  public async discard() {
    if (this._originalLayoutJson) {
      const original = JSON.parse(this._originalLayoutJson);
      this.dispatchEvent(new CustomEvent('update-active-layout', { detail: original }));
      this.notifyDirty(false);
    }
  }

  public async addNew() {
    this.dispatchEvent(new CustomEvent('prepare-new-layout', { bubbles: true, composed: true }));
    const draft: Partial<Layout> = {
      id: '',
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    await this._layoutSettingsDialog.show(draft as Layout);
  }

  public async requestDelete() {
    if (!this.activeLayout) return;
    this.dispatchEvent(new CustomEvent('delete-layout', { detail: { layout: this.activeLayout } }));
  }

  private _onAddItemToLayout(dt: DisplayType) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: dt.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 'landscape' as 'landscape' | 'portrait'
    };
    
    if (this.activeLayout) {
      const updates = {
        items: [...(this.activeLayout.items || []), newItem]
      };
      this.dispatchEvent(new CustomEvent('update-active-layout', { detail: updates }));
      this.dispatchEvent(new CustomEvent('select-item', { detail: { id } }));
    }
    this._showDisplayMenu = false;
  }

  render() {
    const listItems = this.layouts.map(l => ({
      id: l.id,
      name: l.name,
      icon: 'layers',
      status: l.status
    }));

    return html`
      <section-layout>
        <div slot="left-bar">
          <sidebar-list
            .items="${listItems}"
            .selectedId="${this.activeLayout?.id || null}"
            @select="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('switch-layout', { detail: this.layouts.find(l => l.id === e.detail.item.id) }))}"
          ></sidebar-list>
        </div>

        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${this.isAdding ? 'Create New Layout' : (this.activeLayout ? html`
              ${this.activeLayout.name}
              <span class="status-badge ${this.activeLayout.status}">${this.activeLayout.status}</span>
            ` : 'Layouts')}
          </div>
          <div class="toolbar-actions">
              <button class="secondary icon-button" title="Layout Settings" @click="${() => this._layoutSettingsDialog.show(this.activeLayout!)}">
                <span class="material-icons">settings</span>
              </button>
          </div>
        </div>

        ${this.viewMode === 'yaml' && this.activeLayout ? html`
          <yaml-editor
            slot="right-main"
            .data="${this.activeLayout}"
            .schemaName="Layout"
            @data-update="${(e: CustomEvent) => {
              this.dispatchEvent(new CustomEvent('update-active-layout', { detail: e.detail }));
              this._checkDirty();
            }}"
          ></yaml-editor>
        ` : (this.activeLayout ? html`
          <div slot="right-main" class="workspace">
            <div class="preview-pane">
              <layout-editor
                .width_mm="${this.activeLayout.canvas_width_mm}"
                .height_mm="${this.activeLayout.canvas_height_mm}"
                .items="${this.activeLayout.items}"
                .displayTypes="${this.displayTypes}"
                .selectedIds="${this.selectedItemId ? [this.selectedItemId] : []}"
                @selection-change="${this._onSelectionChange}"
                @item-update="${(e: CustomEvent) => this._onItemUpdate(e.detail.id, e.detail.updates)}"
                @edit-item="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('edit-item', { detail: { id: e.detail.id } }))}"
                @delete-item="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('delete-item', { detail: { id: e.detail.id } }))}"
              ></layout-editor>
            </div>
            
            <div class="content-pane">
              <div class="pane-header">
                <div class="pane-title">Layout Items</div>
                <div class="pane-toolbar">
                  <div class="dropdown">
                    <button id="btn-add-display" class="secondary icon-button" title="Add Display" @click="${() => this._showDisplayMenu = !this._showDisplayMenu}">
                      <span class="material-icons">add</span>
                    </button>
                    <div id="menu-display-types" class="dropdown-menu ${this._showDisplayMenu ? 'show' : ''}">
                      ${this.displayTypes.map(dt => html`
                        <div class="display-type-item" @click="${() => this._onAddItemToLayout(dt)}">
                          <div class="display-type-info">
                            <span class="display-type-name">${dt.name}</span>
                            <span class="display-type-meta">${dt.width_mm}x${dt.height_mm}mm | ${dt.colour_type}</span>
                          </div>
                        </div>
                      `)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="content-list">
                ${this.activeLayout.items?.map((item, index) => {
                  const dt = this.displayTypes.find(t => t.id === item.display_type_id);
                  return html`
                    <div 
                      class="layout-item-card ${this.selectedItemId === item.id ? 'selected' : ''}"
                      @click="${() => this.dispatchEvent(new CustomEvent('select-item', { detail: { id: item.id } }))}"
                      @dblclick="${() => this.dispatchEvent(new CustomEvent('edit-item', { detail: { id: item.id } }))}"
                    >
                      <span class="material-icons item-icon">settings_input_component</span>
                      <div class="item-info">
                        <span class="item-name">#${index + 1}: ${dt?.name || 'Unknown'}</span>
                        <span class="item-meta">Pos: ${item.x_mm}, ${item.y_mm}mm | ${item.orientation}</span>
                      </div>
                    </div>
                  `;
                })}
                
                ${(!this.activeLayout.items || this.activeLayout.items.length === 0) ? html`
                  <div style="padding: 2rem; color: #888; text-align: center; font-size: 13px;">
                    No items in this layout. Add displays to begin.
                  </div>
                ` : ''}
              </div>

              <div class="pane-footer">
                <div class="toolbar-actions">
                  <button 
                    class="secondary icon-button" 
                    title="Edit Item" 
                    ?disabled="${!this.selectedItemId}"
                    @click="${() => this.dispatchEvent(new CustomEvent('edit-item', { detail: { id: this.selectedItemId } }))}"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                  <button 
                    class="danger icon-button" 
                    title="Delete Item" 
                    ?disabled="${!this.selectedItemId}"
                    @click="${() => this.dispatchEvent(new CustomEvent('delete-item', { detail: { id: this.selectedItemId } }))}"
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
            title="Canvas Layouts"
            icon="layers"
            message="Design your multi-display canvas here. Combine different eInk screens into a unified digital surface."
          ></empty-view>
        `)}
      </section-layout>

      <layout-settings-dialog @save="${(e: CustomEvent) => {
        this.dispatchEvent(new CustomEvent('update-active-layout', { detail: e.detail.settings }));
        this._checkDirty();
        this.showMessage(this.activeLayout?.id ? 'Settings applied' : 'Draft settings applied', 'success');
      }}"></layout-settings-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'layouts-view': LayoutsView;
  }
}
