import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { HaStateController, type AppSection } from './controllers/HaStateController';

import './components/app-header';
import './components/app-toolbar';
import './components/side-bar';
import './components/layout-editor';
import './components/display-types-view';
import { DisplayTypesView } from './components/display-types-view';
import './components/item-settings-dialog';
import './components/layout-settings-dialog';
import './components/confirm-dialog';
import './components/yaml-editor';
import './components/shared/section-layout';
import './components/shared/empty-view';

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
      background: white;
    }
    yaml-editor {
      flex: 1;
    }
  `;

  @state() private _mousePos: { x: number | null, y: number | null } = { x: null, y: null };
  @state() private _viewMode: 'graphical' | 'yaml' = 'graphical';

  @query('item-settings-dialog') private _itemDialog!: ItemSettingsDialog;
  @query('layout-settings-dialog') private _layoutSettingsDialog!: LayoutSettingsDialog;
  @query('confirm-dialog') private _confirmDialog!: ConfirmDialog;

  private async _handleEditLayout() {
    if (this.state.activeLayout) {
      await this._layoutSettingsDialog.show(this.state.activeLayout);
    }
  }
  @query('display-types-view') private _displayTypesView?: DisplayTypesView;

  @state() private _displayTypesDirty = false;
  @state() private _canDelete = false;

  private async _handleSave() {
    if (this.state.activeSection === 'layouts') {
      await this.state.saveActiveLayout();
    } else if (this.state.activeSection === 'display-types') {
      this._displayTypesView?.save();
    }
  }

  private async _handleDiscard() {
    const confirmed = await this._confirmDialog.show({
      title: 'Discard Changes?',
      message: `Are you sure you want to discard all unsaved changes to this ${this.state.activeSection === 'layouts' ? 'layout' : 'display type'}?`,
      confirmText: 'Discard',
      type: 'danger'
    });

    if (confirmed) {
      if (this.state.activeSection === 'layouts') {
        this.state.discardChanges();
        this.state.showMessage('Changes discarded', 'info');
      } else if (this.state.activeSection === 'display-types') {
        this._displayTypesView?.discard();
        this.state.showMessage('Changes discarded', 'info');
      }
    }
  }

  // Toolbar Actions
  private async _handleCreateLayout() {
    const newLayout: Partial<Layout> = {
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    await this._layoutSettingsDialog.show(newLayout as Layout);
  }

  // Sidebar Actions
  private async _onAddDisplayType() {
    this.state.setSection('display-types');
  }

  private async _onEditDisplayType(_e: CustomEvent<DisplayType>) {
    this.state.setSection('display-types');
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
    await this.state.saveDisplayType(e.detail.displayType);
  }

  private async _onHeaderDeleteItem() {
    if (this.state.activeSection === 'display-types') {
      this._displayTypesView?.requestDelete();
    } else if (this.state.activeSection === 'layouts' && this.state.activeLayout) {
      const confirmed = await this._confirmDialog.show({
        title: 'Delete Layout?',
        message: `Are you sure you want to permanently remove "${this.state.activeLayout.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        type: 'danger'
      });

      if (confirmed) {
        await this.state.deleteLayout(this.state.activeLayout);
      }
    }
  }

  private async _onEditItem(e: CustomEvent<{ id: string }>) {
    const item = this.state.activeLayout?.items.find(i => i.id === e.detail.id);
    if (item) {
      await this._itemDialog.show(item, this.state.displayTypes);
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
        .isDirty="${this.state.isDirty || this._displayTypesDirty}"
        .viewMode="${this._viewMode}"
        .activeSection="${this.state.activeSection}"
        .canDelete="${this.state.activeSection === 'layouts' ? !!this.state.activeLayout : this._canDelete}"
        @save-changes="${this._handleSave}"
        @discard-changes="${this._handleDiscard}"
        @delete-item="${this._onHeaderDeleteItem}"
        @toggle-view-mode="${() => this._viewMode = (this._viewMode === 'graphical' ? 'yaml' : 'graphical')}"
        @set-section="${(e: CustomEvent) => this.state.setSection(e.detail)}"
      ></app-header>

      ${this.state.activeSection === 'layouts' ? this._renderLayoutsSection() : 
        this.state.activeSection === 'display-types' ? this._renderDisplayTypesSection() :
        this._renderEmptySection()}

      <item-settings-dialog 
        @save="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"
        @delete="${(e: CustomEvent) => this._onDeleteItem(e)}"
      ></item-settings-dialog>
      <layout-settings-dialog @save="${this._onSaveLayoutSettings}"></layout-settings-dialog>
      <confirm-dialog></confirm-dialog>
    `;
  }

  private _renderLayoutsSection() {
    return html`
      <section-layout>
        <side-bar
          slot="left-bar"
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

        <app-toolbar
          slot="right-top-bar"
          .layouts="${this.state.layouts}"
          .activeLayout="${this.state.activeLayout}"
          .mousePos="${this._mousePos}"
          @switch-layout="${(e: CustomEvent) => this.state.switchLayout(e.detail)}"
          @create-layout="${this._handleCreateLayout}"
          @edit-layout="${this._handleEditLayout}"
        ></app-toolbar>

        <div slot="right-main" style="height: 100%; display: flex; flex-direction: column;">
          <layout-editor
            ?hidden="${this._viewMode !== 'graphical' || !this.state.activeLayout}"
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

          <yaml-editor
            ?hidden="${this._viewMode !== 'yaml' || !this.state.activeLayout}"
            .data="${this.state.activeLayout}"
            .schemaName="Layout"
            @data-update="${(e: CustomEvent) => this.state.updateActiveLayout(e.detail)}"
          ></yaml-editor>
        </div>
      </section-layout>
    `;
  }

  private _renderDisplayTypesSection() {
    return html`
      <display-types-view
        .displayTypes="${this.state.displayTypes}"
        @save="${this._onSaveDisplayType}"
        @delete-display-type="${this._onDeleteDisplayType}"
        @dirty-state-change="${(e: CustomEvent) => this._displayTypesDirty = e.detail.isDirty}"
        @can-delete-change="${(e: CustomEvent) => this._canDelete = e.detail.canDelete}"
        @request-confirmation="${async (e: CustomEvent) => {
          const result = await this._confirmDialog.show(e.detail.config);
          e.detail.callback(result);
        }}"
      ></display-types-view>
    `;
  }

  private _renderEmptySection() {
    const sections = {
      'images': { title: 'Image Library', icon: 'image', message: 'Upload and process images for your displays.' },
      'scenes': { title: 'Smart Scenes', icon: 'landscape', message: 'Compose complex scenes by combining layouts, images and live data.' }
    };
    const active = sections[this.state.activeSection as Exclude<AppSection, 'layouts' | 'display-types'>];
    
    return html`
      <section-layout>
        <div slot="left-bar" style="padding: 1rem; color: #666; font-size: 14px;">
          Sidebar for ${active.title} section coming soon.
        </div>
        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          ${active.title} Toolbar
        </div>
        <empty-view 
          slot="right-main"
          .title="${active.title}"
          .icon="${active.icon}"
          .message="${active.message}"
        ></empty-view>
      </section-layout>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
