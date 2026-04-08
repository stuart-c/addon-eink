import { LitElement, html, css } from 'lit';
import './components/layout-editor.js';
import './components/display-type-dialog.js';
import './components/item-settings-dialog.js';
import './components/layout-settings-dialog.js';
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

    /* Dropdown Styles */
    .dropdown {
      position: relative;
      display: inline-block;
    }
    .dropdown-trigger {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .dropdown-trigger:hover {
      background: #f0f2f5;
    }
    .dropdown-trigger span {
      font-size: 1.1rem;
      font-weight: 700;
      color: #333;
    }
    .dropdown-trigger .chevron {
      font-size: 0.8rem;
      color: #666;
      transition: transform 0.2s;
    }
    .dropdown-trigger.active .chevron {
      transform: rotate(180deg);
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      min-width: 220px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border: 1px solid #eee;
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
    .dropdown-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #444;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s;
    }
    .dropdown-item:hover {
      background: #f0faff;
      color: #03a9f4;
    }
    .dropdown-item.selected {
      background: #e1f5fe;
      color: #03a9f4;
      font-weight: 600;
    }
    .dropdown-divider {
      height: 1px;
      background: #eee;
      margin: 4px 0;
    }
    .dropdown-item.action {
      color: #03a9f4;
      font-weight: 600;
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  static properties = {
    _connected: { type: Boolean },
    _displayTypes: { type: Array },
    _layouts: { type: Array },
    _activeLayout: { type: Object },
    _selectedItemId: { type: String },
    _saving: { type: Boolean },
    _message: { type: String },
    _mousePos: { type: Object },
    _showLayoutMenu: { type: Boolean },
  };

  constructor() {
    super();
    this._connected = false;
    this._displayTypes = [];
    this._layouts = [];
    this._selectedItemId = null;
    this._saving = false;
    this._message = '';
    this._showLayoutMenu = false;
    this._activeLayout = null;
    this._mousePos = { x: null, y: null };
  }

  connectedCallback() {
    super.connectedCallback();
    this._handleGlobalClick = (e) => {
      if (this._showLayoutMenu && !e.composedPath().some(el => el.classList?.contains('dropdown'))) {
        this._showLayoutMenu = false;
      }
    };
    window.addEventListener('click', this._handleGlobalClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this._handleGlobalClick);
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
      this._layouts = await api.getCollection('layout');
      
      if (this._layouts.length > 0) {
        if (!this._activeLayout) {
          this._activeLayout = this._layouts[0];
        } else {
          const fresh = this._layouts.find(l => l.id === this._activeLayout.id);
          if (fresh) this._activeLayout = fresh;
        }
      } else {
        const defaultLayout = {
          id: 'default',
          name: 'Main Layout',
          canvas_width_mm: 500,
          canvas_height_mm: 500,
          grid_snap_mm: 5,
          items: []
        };
        this._activeLayout = defaultLayout;
        this._layouts = [defaultLayout];
        await api.createItem('layout', defaultLayout);
      }
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

  _handleEditLayout() {
    this.shadowRoot.querySelector('layout-settings-dialog').show(this._activeLayout);
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
    this._showLayoutMenu = false;
  }

  _handleSwitchLayout(layout) {
    this._activeLayout = layout;
    this._selectedItemId = null;
    this._showLayoutMenu = false;
  }

  async _onSaveLayoutSettings(e) {
    const settings = e.detail.settings;
    if (!settings.id) {
      settings.id = Math.random().toString(36).substr(2, 9);
      try {
        await api.createItem('layout', settings);
        this._activeLayout = settings;
        await this._fetchData();
        this._showMessage('New layout created', 'success');
      } catch (err) {
        this._showMessage(`Error: ${err.message}`, 'error');
      }
    } else {
      const updated = { ...this._activeLayout, ...settings };
      this._activeLayout = updated;
      
      const index = this._layouts.findIndex(l => l.id === settings.id);
      if (index !== -1) {
        this._layouts[index] = updated;
        this._layouts = [...this._layouts];
      }
      
      this.requestUpdate();
      this._showMessage('Settings applied', 'success');
    }
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
    if (this._activeLayout.items.some(i => i.invalid)) {
      this._showMessage('Cannot save: Displays are overlapping!', 'error');
      return;
    }
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
          <button class="secondary" @click="${this._handleEditLayout}">
            Settings
          </button>
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
              <div class="list-item" @dblclick="${() => this._handleEditDisplayType(dt)}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong>${dt.name}</strong>
                    <div style="font-size: 11px; color: #888;">${dt.width_mm}x${dt.height_mm}mm</div>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="secondary" style="padding: 4px 8px; font-size: 10px;" @click="${(e) => { e.stopPropagation(); this._addItemToLayout(dt); }}">Add</button>
                    <button @click="${(e) => { e.stopPropagation(); this._handleEditDisplayType(dt); }}" class="secondary" style="padding: 4px 8px; font-size: 10px;">Edit</button>
                  </div>
                </div>
              </div>
            `)}
          </div>

          <div class="sidebar-section" style="flex: 2;">
            <h3>Layout Items</h3>
            ${this._activeLayout?.items.map(item => {
              const dt = this._displayTypes.find(t => t.id === item.display_type_id);
              return html`
                <div 
                  class="list-item ${this._selectedItemId === item.id ? 'selected' : ''}" 
                  @click="${() => this._selectedItemId = item.id}"
                  @dblclick="${() => this._handleEditItem(item.id)}"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>${dt?.name || 'Unknown'}</strong>
                      <div style="font-size: 11px; color: #666;">Pos: ${item.x_mm}, ${item.y_mm} | Rot: ${item.orientation}°</div>
                    </div>
                    <div style="display: flex; gap: 4px;">
                      <button class="secondary" style="padding: 4px; font-size: 10px;" @click="${(e) => { e.stopPropagation(); this._handleRotate(item.id); }}">Rotate</button>
                      <button class="secondary" style="padding: 4px; font-size: 10px;" @click="${(e) => { e.stopPropagation(); this._handleEditItem(item.id); }}">Settings</button>
                    </div>
                  </div>
                </div>
              `;
            }) || ''}
          </div>
        </div>

        <div class="editor-container">
          <div class="toolbar">
            <div class="dropdown">
              <div class="dropdown-trigger ${this._showLayoutMenu ? 'active' : ''}" @click="${() => this._showLayoutMenu = !this._showLayoutMenu}">
                <span>${this._activeLayout?.name || 'Loading...'}</span>
                <div class="chevron">▼</div>
              </div>
              <div class="dropdown-menu ${this._showLayoutMenu ? 'show' : ''}">
                ${this._layouts.map(l => html`
                  <div class="dropdown-item ${this._activeLayout?.id === l.id ? 'selected' : ''}" @click="${() => this._handleSwitchLayout(l)}">
                    ${l.name}
                    ${this._activeLayout?.id === l.id ? html`✓` : ''}
                  </div>
                `)}
                <div class="dropdown-divider"></div>
                <div class="dropdown-item action" @click="${this._handleCreateLayout}">
                  + Create new layout...
                </div>
              </div>
            </div>
            <div style="font-size: 12px; color: #666; display: flex; align-items: center; gap: 1rem;">
              ${this._mousePos?.x !== null ? html`
                <span style="color: #03a9f4; font-weight: 600;">
                  X: ${this._mousePos.x}mm, Y: ${this._mousePos.y}mm
                </span>
              ` : ''}
              <span style="${this._mousePos?.x !== null ? 'padding-left: 1rem; border-left: 1px solid #ddd;' : ''}">
                Canvas: ${this._activeLayout?.canvas_width_mm}x${this._activeLayout?.canvas_height_mm}mm
              </span>
            </div>
          </div>
          <layout-editor
            ?hidden="${!this._activeLayout}"
            .width_mm="${this._activeLayout?.canvas_width_mm}"
            .height_mm="${this._activeLayout?.canvas_height_mm}"
            .gridSnap="${this._activeLayout?.grid_snap_mm || 5}"
            .items="${this._activeLayout?.items || []}"
            .displayTypes="${this._displayTypes}"
            .selectedId="${this._selectedItemId}"
            @item-moved="${(e) => this._updateItem(e.detail.id, { x_mm: e.detail.x, y_mm: e.detail.y })}"
            @select-item="${(e) => this._selectedItemId = e.detail.id}"
            @edit-item="${(e) => this._handleEditItem(e.detail.id)}"
            @mouse-move="${(e) => this._mousePos = e.detail}"
            @rotate-item="${(e) => this._handleRotate(e.detail.id)}"
          ></layout-editor>
        </div>
      </main>

      <display-type-dialog @save="${this._onSaveDisplayType}"></display-type-dialog>
      <item-settings-dialog @save="${this._onSaveItemSettings}"></item-settings-dialog>
      <layout-settings-dialog @save="${this._onSaveLayoutSettings}"></layout-settings-dialog>
    `;
  }
}

customElements.define('app-root', AppRoot);
