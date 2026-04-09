import { LitElement, html, css } from 'lit';
import { api } from './services/HaApiClient.js';
import { HaStateController } from './controllers/HaStateController.js';
import { commonStyles } from './styles/common-styles.js';
import './components/app-header.js';
import './components/side-bar.js';
import './components/app-toolbar.js';
import './components/layout-editor.js';
import './components/display-type-dialog.js';
import './components/item-settings-dialog.js';
import './components/layout-settings-dialog.js';
import './components/confirm-dialog.js';

export class AppRoot extends LitElement {
  static styles = [
    commonStyles,
    css`
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
      }
      .editor-container {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        flex-direction: column;
      }
    `
  ];

  state = new HaStateController(this);

  static properties = {
    _mousePos: { type: Object },
  };

  constructor() {
    super();
    this._mousePos = { x: null, y: null };
  }

  // --- Event Handlers ---

  _handleEditLayout() {
    this.shadowRoot.querySelector('layout-settings-dialog').show(this.state.activeLayout);
  }

  _handleCreateLayout() {
    const newLayout = {
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    this.shadowRoot.querySelector('layout-settings-dialog').show(newLayout);
  }

  _handleAddDisplayType() {
    this.shadowRoot.querySelector('display-type-dialog').show();
  }

  _handleEditDisplayType(e) {
    this.shadowRoot.querySelector('display-type-dialog').show(e.detail);
  }

  async _handleDeleteDisplayType(e) {
    const dt = e.detail;
    const confirmed = await this.shadowRoot.querySelector('confirm-dialog').show({
      title: 'Delete Display Type?',
      message: `Are you sure you want to permanently remove "${dt.name}"?`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteDisplayType(dt);
    }
  }

  _handleAddItemToLayout(e) {
    const dt = e.detail;
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: dt.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 0
    };
    this.state.activeLayout.items = [...this.state.activeLayout.items, newItem];
    this.state.selectedItemId = id;
    this.requestUpdate();
  }

  _handleEditItem(e) {
    const id = e.detail.id;
    const item = this.state.activeLayout.items.find(i => i.id === id);
    if (item) {
      this.shadowRoot.querySelector('item-settings-dialog').show(item, this.state.displayTypes);
    }
  }

  async _handleDeleteItem(e) {
    const id = e.detail.id;
    const item = this.state.activeLayout.items.find(i => i.id === id);
    const dt = this.state.displayTypes.find(t => t.id === item?.display_type_id);
    
    const confirmed = await this.shadowRoot.querySelector('confirm-dialog').show({
      title: 'Delete display?',
      message: `Remove the "${dt?.name || 'unknown'}" display from this layout?`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      this.state.activeLayout.items = this.state.activeLayout.items.filter(i => i.id !== id);
      if (this.state.selectedItemId === id) {
        this.state.selectedItemId = null;
      }
      this.state.showMessage('Item deleted', 'success');
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <app-header 
        .message="${this.state.message}" 
        .connected="${this.state.connected}"
        .saving="${this.state.isSaving}"
        @edit-layout="${this._handleEditLayout}"
        @save-layout="${() => this.state.saveActiveLayout()}"
      ></app-header>

      <main>
        <side-bar
          .displayTypes="${this.state.displayTypes}"
          .activeLayout="${this.state.activeLayout}"
          .selectedItemId="${this.state.selectedItemId}"
          @add-display-type="${this._handleAddDisplayType}"
          @edit-display-type="${this._handleEditDisplayType}"
          @delete-display-type="${this._handleDeleteDisplayType}"
          @add-item-to-layout="${this._handleAddItemToLayout}"
          @select-item="${(e) => this.state.selectedItemId = e.detail.id}"
          @edit-item="${this._handleEditItem}"
          @rotate-item="${(e) => this.state.updateItem(e.detail.id, { orientation: 
            this.state.activeLayout.items.find(i => i.id === e.detail.id).orientation === 0 ? 90 : 0 
          })}"
          @delete-item="${this._handleDeleteItem}"
        ></side-bar>

        <div class="editor-container">
          <app-toolbar
            .layouts="${this.state.layouts}"
            .activeLayout="${this.state.activeLayout}"
            .mousePos="${this._mousePos}"
            @switch-layout="${(e) => this.state.switchLayout(e.detail)}"
            @create-layout="${this._handleCreateLayout}"
          ></app-toolbar>

          <layout-editor
            ?hidden="${!this.state.activeLayout}"
            .width_mm="${this.state.activeLayout?.canvas_width_mm}"
            .height_mm="${this.state.activeLayout?.canvas_height_mm}"
            .gridSnap="${this.state.activeLayout?.grid_snap_mm || 5}"
            .items="${this.state.activeLayout?.items || []}"
            .displayTypes="${this.state.displayTypes}"
            .selectedId="${this.state.selectedItemId}"
            @item-moved="${(e) => this.state.updateItem(e.detail.id, { x_mm: e.detail.x, y_mm: e.detail.y })}"
            @select-item="${(e) => this.state.selectedItemId = e.detail.id}"
            @edit-item="${this._handleEditItem}"
            @mouse-move="${(e) => this._mousePos = e.detail}"
            @rotate-item="${(e) => this.state.updateItem(e.detail.id, { orientation: 
              this.state.activeLayout.items.find(i => i.id === e.detail.id).orientation === 0 ? 90 : 0 
            })}"
            @item-delete="${this._handleDeleteItem}"
            @layout-resized="${(e) => this.state.updateActiveLayout({ canvas_width_mm: e.detail.width, canvas_height_mm: e.detail.height })}"
          ></layout-editor>
        </div>
      </main>

      <display-type-dialog @save="${async (e) => {
        const dt = e.detail.displayType;
        if (this.state.displayTypes.find(t => t.id === dt.id)) {
          await api.updateItem('display_type', dt.id, dt);
        } else {
          await api.createItem('display_type', dt);
        }
        await this.state.refresh();
        this.state.showMessage('Display type saved!', 'success');
      }}"></display-type-dialog>

      <item-settings-dialog @save="${(e) => {
        this.state.updateItem(e.detail.id, e.detail.updates);
        this.state.showMessage('Item settings updated', 'success');
      }}"></item-settings-dialog>

      <layout-settings-dialog @save="${async (e) => {
        const settings = e.detail.settings;
        if (!settings.id) {
          settings.id = Math.random().toString(36).substr(2, 9);
          await api.createItem('layout', settings);
          this.state.activeLayout = settings;
          await this.state.refresh();
          this.state.showMessage('New layout created', 'success');
        } else {
          this.state.updateActiveLayout(settings);
          this.state.showMessage('Settings applied', 'success');
        }
      }}"></layout-settings-dialog>
      
      <confirm-dialog></confirm-dialog>
    `;
  }
}

customElements.define('app-root', AppRoot);
