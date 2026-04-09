import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { HaStateController } from './controllers/HaStateController';

import './components/app-header';
import './components/app-toolbar';
import './components/side-bar';
import './components/layout-editor';
import './components/display-type-dialog';
import './components/item-settings-dialog';
import './components/layout-settings-dialog';
import './components/confirm-dialog';

import { DisplayTypeDialog } from './components/display-type-dialog';
import { ItemSettingsDialog } from './components/item-settings-dialog';
import { LayoutSettingsDialog } from './components/layout-settings-dialog';
import { ConfirmDialog } from './components/confirm-dialog';
import { DisplayType, Layout } from './services/HaApiClient';

@customElement('app-root')
export class AppRoot extends LitElement {
  private state = new HaStateController(this);

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    main {
      flex: 1;
      display: flex;
      background-color: #f0f2f5;
      overflow: hidden;
    }
    .editor-container {
      flex: 1;
      min-width: 0;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  `;

  @state() private _mousePos: { x: number | null, y: number | null } = { x: null, y: null };

  @query('display-type-dialog') private _displayTypeDialog!: DisplayTypeDialog;
  @query('item-settings-dialog') private _itemDialog!: ItemSettingsDialog;
  @query('layout-settings-dialog') private _layoutSettingsDialog!: LayoutSettingsDialog;
  @query('confirm-dialog') private _confirmDialog!: ConfirmDialog;

  // Header Actions
  private _handleEditLayout() {
    if (this.state.activeLayout) {
      this._layoutSettingsDialog.show(this.state.activeLayout);
    }
  }

  // Toolbar Actions
  private _handleCreateLayout() {
    const newLayout: Partial<Layout> = {
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    this._layoutSettingsDialog.show(newLayout as Layout);
  }

  // Sidebar Actions
  private _onAddDisplayType() {
    this._displayTypeDialog.show();
  }

  private _onEditDisplayType(e: CustomEvent<DisplayType>) {
    this._displayTypeDialog.show(e.detail);
  }

  private async _onDeleteDisplayType(e: CustomEvent<DisplayType>) {
    const confirmed = await this._confirmDialog.show({
      title: 'Delete Display Type?',
      message: `Are you sure you want to permanently remove "${e.detail.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteDisplayType(e.detail);
    }
  }

  private _onAddItemToLayout(e: CustomEvent<DisplayType>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: e.detail.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 0 as 0 | 90
    };
    this.state.updateActiveLayout({
      items: [...(this.state.activeLayout?.items || []), newItem]
    });
    this.state.selectedItemId = id;
  }

  // Dialog Callbacks
  private async _onSaveLayoutSettings(e: CustomEvent) {
    const settings = e.detail.settings;
    if (!settings.id) {
       // New layout logic is handled in HaStateController or here
       // For now keeping it simple as per original
    }
    this.state.updateActiveLayout(settings);
    this.state.showMessage('Settings applied', 'success');
  }

  private async _onSaveDisplayType(e: CustomEvent) {
    // Handled in HaStateController via API would be cleaner but following original pattern
    this.state.refresh(); 
  }

  private _onEditItem(e: CustomEvent<{ id: string }>) {
    const item = this.state.activeLayout?.items.find(i => i.id === e.detail.id);
    if (item) {
      this._itemDialog.show(item, this.state.displayTypes);
    }
  }

  private async _onDeleteItem(e: CustomEvent<{ id: string }>) {
    const item = this.state.activeLayout?.items.find(i => i.id === e.detail.id);
    const dt = this.state.displayTypes.find(t => t.id === item?.display_type_id);
    
    const confirmed = await this._confirmDialog.show({
      title: 'Delete display?',
      message: `Are you sure you want to remove the "${dt?.name || 'unknown'}" display from this layout?`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      this.state.updateActiveLayout({
        items: this.state.activeLayout?.items.filter(i => i.id !== e.detail.id)
      });
      if (this.state.selectedItemId === e.detail.id) {
        this.state.selectedItemId = null;
      }
      this.state.showMessage('Item deleted', 'success');
    }
  }

  protected render() {
    return html`
      <app-header 
        .connected="${this.state.connected}"
        .message="${this.state.message}"
        .isSaving="${this.state.isSaving}"
        @edit-layout="${this._handleEditLayout}"
        @save-layout="${() => this.state.saveActiveLayout()}"
      ></app-header>

      <main>
        <side-bar
          .displayTypes="${this.state.displayTypes}"
          .activeLayout="${this.state.activeLayout}"
          .selectedItemId="${this.state.selectedItemId}"
          @add-display-type="${this._onAddDisplayType}"
          @edit-display-type="${this._onEditDisplayType}"
          @delete-display-type="${this._onDeleteDisplayType}"
          @add-item-to-layout="${this._onAddItemToLayout}"
          @select-item="${(e: CustomEvent) => this.state.selectedItemId = e.detail.id}"
          @edit-item="${this._onEditItem}"
          @rotate-item="${(e: CustomEvent) => this.state.updateItem(e.detail.id, { orientation: (this.state.activeLayout?.items.find(i => i.id === e.detail.id)?.orientation === 0 ? 90 : 0) })}"
          @delete-item="${this._onDeleteItem}"
        ></side-bar>

        <div class="editor-container">
          <app-toolbar
            .layouts="${this.state.layouts}"
            .activeLayout="${this.state.activeLayout}"
            .mousePos="${this._mousePos}"
            @switch-layout="${(e: CustomEvent) => this.state.switchLayout(e.detail)}"
            @create-layout="${this._handleCreateLayout}"
          ></app-toolbar>

          <layout-editor
            ?hidden="${!this.state.activeLayout}"
            .width_mm="${this.state.activeLayout?.canvas_width_mm || 0}"
            .height_mm="${this.state.activeLayout?.canvas_height_mm || 0}"
            .gridSnap="${this.state.activeLayout?.grid_snap_mm || 5}"
            .items="${this.state.activeLayout?.items || []}"
            .displayTypes="${this.state.displayTypes}"
            .selectedId="${this.state.selectedItemId}"
            @item-moved="${(e: CustomEvent) => this.state.updateItem(e.detail.id, { x_mm: e.detail.x, y_mm: e.detail.y })}"
            @select-item="${(e: CustomEvent) => this.state.selectedItemId = e.detail.id}"
            @edit-item="${(e: CustomEvent) => this._onEditItem(e)}"
            @mouse-move="${(e: CustomEvent) => this._mousePos = e.detail}"
            @rotate-item="${(e: CustomEvent) => this.state.updateItem(e.detail.id, { orientation: (this.state.activeLayout?.items.find(i => i.id === e.detail.id)?.orientation === 0 ? 90 : 0) })}"
            @item-delete="${(e: CustomEvent) => this._onDeleteItem(e)}"
            @layout-resized="${(e: CustomEvent) => this.state.updateActiveLayout({ canvas_width_mm: e.detail.width, canvas_height_mm: e.detail.height })}"
          ></layout-editor>
        </div>
      </main>

      <display-type-dialog @save="${this._onSaveDisplayType}"></display-type-dialog>
      <item-settings-dialog @save="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"></item-settings-dialog>
      <layout-settings-dialog @save="${this._onSaveLayoutSettings}"></layout-settings-dialog>
      <confirm-dialog></confirm-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
