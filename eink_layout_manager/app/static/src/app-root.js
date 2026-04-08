import { LitElement, html, css } from 'lit';
import './components/layout-editor.js';
import './components/display-type-dialog.js';
import './components/item-settings-dialog.js';
import { api } from './services/HaApiClient.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    header {
      background-color: #03a9f4;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }
    main {
      flex: 1;
      display: flex;
      background-color: #f0f2f5;
    }
    .sidebar {
      width: 320px;
      background-color: white;
      border-right: 1px solid #ddd;
      display: flex;
      flex-direction: column;
    }
    .sidebar-section {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      flex: 1;
      overflow-y: auto;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    h3 { margin: 0; font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .list-item {
      padding: 0.75rem;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    .list-item:hover { border-color: #03a9f4; background: #f0faff; }
    .list-item.selected { border-color: #03a9f4; background: #e1f5fe; box-shadow: 0 2px 8px rgba(3,169,244,0.1); }
    
    .editor-container {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      padding: 0.75rem 1.5rem;
      background: white;
      border-bottom: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      background: #03a9f4;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #0288d1; }
    button.secondary { background: white; color: #03a9f4; border: 1px solid #03a9f4; }
  `;

  static properties = {
    _connected: { type: Boolean },
    _displayTypes: { type: Array },
    _activeLayout: { type: Object },
    _selectedItemId: { type: String },
    _saving: { type: Boolean },
    _message: { type: String },
  };

  constructor() {
    super();
    this._connected = false;
    this._displayTypes = [];
    this._selectedItemId = null;
    this._saving = false;
    this._message = '';
    this._activeLayout = {
      id: 'default',
      name: 'Main Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      items: []
    };
  }

  async firstUpdated() {
    await this._checkBackend();
    await this._fetchData();
  }

  async _checkBackend() {
    this._connected = await api.ping();
  }

  async _fetchData() {
    try {
      this._displayTypes = await api.getCollection('display_type');
      // If we had layouts, we'd fetch them here
    } catch (e) {
      console.error('Fetch failed', e);
    }
  }

  _handleAddDisplayType() {
    this.shadowRoot.querySelector('display-type-dialog').show();
  }

  _handleEditDisplayType(dt) {
    this.shadowRoot.querySelector('display-type-dialog').show(dt);
  }

  async _onSaveDisplayType(e) {
    const dt = e.detail.displayType;
    try {
       if (this._displayTypes.find(t => t.id === dt.id)) {
         await api.updateItem('display_type', dt.id, dt);
       } else {
         await api.createItem('display_type', dt);
       }
       await this._fetchData();
       this._showMessage('Display type saved!', 'success');
    } catch (err) {
       this._showMessage(`Error: ${err.message}`, 'error');
    }
  }

  _addItemToLayout(dt) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: dt.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 0
    };
    this._activeLayout.items = [...this._activeLayout.items, newItem];
    this._selectedItemId = id;
    this.requestUpdate();
  }

  _updateItem(id, updates) {
    const item = this._activeLayout.items.find(i => i.id === id);
    if (item) {
      Object.assign(item, updates);
      this._activeLayout.items = [...this._activeLayout.items];
      this.requestUpdate();
    }
  }

  _handleRotate(id) {
    const item = this._activeLayout.items.find(i => i.id === id);
    if (item) {
      this._updateItem(id, { orientation: item.orientation === 0 ? 90 : 0 });
    }
  }

  _handleEditItem(id) {
    const item = this._activeLayout.items.find(i => i.id === id);
    if (item) {
      this.shadowRoot.querySelector('item-settings-dialog').show(item, this._displayTypes);
    }
  }

  _onSaveItemSettings(e) {
    this._updateItem(e.detail.id, e.detail.updates);
    this._showMessage('Item settings updated', 'success');
  }

  async _handleSaveLayout() {
    this._saving = true;
    try {
      await api.updateItem('layout', this._activeLayout.id, this._activeLayout);
      this._showMessage('Layout saved!', 'success');
    } catch (e) {
      this._showMessage(`Failed: ${e.message}`, 'error');
    } finally {
      this._saving = false;
    }
  }

  _showMessage(text) {
    this._message = text;
    setTimeout(() => { this._message = ''; }, 3000);
  }

  render() {
    return html`
      <header>
        <div><strong>eInk Layout Manager</strong></div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          ${this._message ? html`<span>${this._message}</span>` : ''}
          <button @click="${this._handleSaveLayout}" ?disabled="${this._saving}">
            ${this._saving ? 'Saving...' : 'Save Layout'}
          </button>
          <span style="font-size: 12px; opacity: 0.8;">Backend: ${this._connected ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <main>
        <div class="sidebar">
          <div class="sidebar-section">
            <div class="sidebar-header">
              <h3>Display Types</h3>
              <button class="secondary" style="padding: 2px 8px; font-size: 11px;" @click="${this._handleAddDisplayType}">+ New</button>
            </div>
            ${this._displayTypes.map(dt => html`
              <div class="list-item" @dblclick="${() => this._handleEditDisplayType(dt)}" @click="${() => this._addItemToLayout(dt)}">
                <div style="display: flex; justify-content: space-between;">
                  <strong>${dt.name}</strong>
                  <span style="font-size: 11px; color: #888;">${dt.width_mm}x${dt.height_mm}mm</span>
                </div>
              </div>
            `)}
          </div>

          <div class="sidebar-section" style="flex: 2;">
            <h3>Layout Items</h3>
            ${this._activeLayout.items.map(item => {
              const dt = this._displayTypes.find(t => t.id === item.display_type_id);
              return html`
                <div class="list-item ${this._selectedItemId === item.id ? 'selected' : ''}" @click="${() => this._selectedItemId = item.id}">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>${dt?.name || 'Unknown'}</strong>
                      <div style="font-size: 11px; color: #666;">Pos: ${item.x_mm}, ${item.y_mm} | Rot: ${item.orientation}°</div>
                    </div>
                    <button class="secondary" style="padding: 4px; font-size: 10px;" @click="${(e) => { e.stopPropagation(); this._handleRotate(item.id); }}">Rotate</button>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>

        <div class="editor-container">
          <div class="toolbar">
            <span><strong>${this._activeLayout.name}</strong></span>
            <div style="font-size: 12px; color: #666;">
              Canvas: ${this._activeLayout.canvas_width_mm}x${this._activeLayout.canvas_height_mm}mm
            </div>
          </div>
          <layout-editor
            .width_mm="${this._activeLayout.canvas_width_mm}"
            .height_mm="${this._activeLayout.canvas_height_mm}"
            .items="${this._activeLayout.items}"
            .displayTypes="${this._displayTypes}"
            .selectedId="${this._selectedItemId}"
            @item-moved="${(e) => this._updateItem(e.detail.id, { x_mm: e.detail.x, y_mm: e.detail.y })}"
            @select-item="${(e) => this._selectedItemId = e.detail.id}"
            @edit-item="${(e) => this._handleEditItem(e.detail.id)}"
          ></layout-editor>
        </div>
      </main>

      <display-type-dialog @save="${this._onSaveDisplayType}"></display-type-dialog>
      <item-settings-dialog @save="${this._onSaveItemSettings}"></item-settings-dialog>
    `;
  }
}

customElements.define('app-root', AppRoot);
