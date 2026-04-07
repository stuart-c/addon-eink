import { LitElement, html, css } from 'lit';
import './components/layout-editor.js';
import { api } from './services/HaApiClient.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    header {
      background-color: #03a9f4;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    main {
      flex: 1;
      display: flex;
      background-color: #f0f2f5;
    }
    .sidebar {
      width: 300px;
      background-color: white;
      border-right: 1px solid #ddd;
      padding: 1rem;
      overflow-y: auto;
    }
    .editor-container {
      flex: 1;
      position: relative;
    }
    .toolbar {
      padding: 0.5rem 1rem;
      background: white;
      border-bottom: 1px solid #ddd;
      display: flex;
      gap: 1rem;
    }
    button {
      background: #03a9f4;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0288d1;
    }
  `;

  static properties = {
    _connected: { type: Boolean },
    _layouts: { type: Array },
    _activeLayout: { type: Object },
    _selectedBoxId: { type: String },
    _saving: { type: Boolean },
    _message: { type: String },
  };

  constructor() {
    super();
    this._connected = false;
    this._layouts = [];
    this._selectedBoxId = null;
    this._saving = false;
    this._message = '';
    this._activeLayout = {
      id: 'preview',
      name: 'Preview Layout',
      width_px: 800,
      height_px: 480,
      boxes: [
        { id: '1', name: 'Header', x: 20, y: 20, width: 760, height: 60, colour: 'BLACK' },
        { id: '2', name: 'Status', x: 20, y: 100, width: 200, height: 300, colour: 'BLACK' }
      ]
    };
  }

  firstUpdated() {
    this._checkBackend();
  }

  async _checkBackend() {
    this._connected = await api.ping();
  }

  _handleAddBox() {
    const id = Math.random().toString(36).substr(2, 9);
    const newBox = {
      id,
      name: `Box ${this._activeLayout.boxes.length + 1}`,
      x: 300,
      y: 200,
      width: 100,
      height: 100,
      colour: 'BLACK'
    };
    this._activeLayout.boxes = [...this._activeLayout.boxes, newBox];
    this._selectedBoxId = id;
    this.requestUpdate();
  }

  _handleDeleteBox(id) {
    this._activeLayout.boxes = this._activeLayout.boxes.filter(b => b.id !== id);
    if (this._selectedBoxId === id) this._selectedBoxId = null;
    this.requestUpdate();
  }

  _updateBox(id, updates) {
    const box = this._activeLayout.boxes.find(b => b.id === id);
    if (box) {
      Object.assign(box, updates);
      this._activeLayout.boxes = [...this._activeLayout.boxes];
      this.requestUpdate();
    }
  }

  async _handleSave() {
    const hasInvalid = this._activeLayout.boxes.some(b => b.invalid);
    if (hasInvalid) {
      this._showMessage('Cannot save: Layout has overlaps.', 'error');
      return;
    }

    this._saving = true;
    try {
      // In a real app, we'd use the actual ID
      await api.updateLayout('preview', this._activeLayout);
      this._showMessage('Layout saved successfully!', 'success');
    } catch (e) {
      this._showMessage(`Failed to save: ${e.message}`, 'error');
    } finally {
      this._saving = false;
    }
  }

  _showMessage(text, type) {
    this._message = text;
    this.requestUpdate();
    setTimeout(() => {
      this._message = '';
      this.requestUpdate();
    }, 3000);
  }

  render() {
    const selectedBox = this._activeLayout.boxes.find(b => b.id === this._selectedBoxId);
    const hasInvalid = this._activeLayout.boxes.some(b => b.invalid);

    return html`
      <header>
        <div><strong>eInk Layout Manager</strong></div>
        <div style="display: flex; gap: 1rem; align-items: center;">
          ${this._message ? html`<span style="font-size: 14px;">${this._message}</span>` : ''}
          <button @click="${this._handleSave}" ?disabled="${this._saving || hasInvalid}" style="background: #white; color: #03a9f4;">
            ${this._saving ? 'Saving...' : 'Save Layout'}
          </button>
          <span>Status: ${this._connected ? 'Connected' : 'Offline'}</span>
        </div>
      </header>

      <main>
        <div class="sidebar">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0;">Objects</h3>
            <button @click="${this._handleAddBox}" style="padding: 4px 8px; font-size: 12px;">+ Add</button>
          </div>
          
          ${this._activeLayout.boxes.map(box => html`
            <div 
              class="layout-card" 
              style="
                margin-bottom: 0.5rem; 
                padding: 0.5rem; 
                border: 1px solid ${this._selectedBoxId === box.id ? '#ff9800' : '#eee'};
                background: ${box.invalid ? '#fff4f4' : 'transparent'};
                cursor: pointer;
              "
              @click="${() => this._selectedBoxId = box.id}"
            >
              <div style="display: flex; justify-content: space-between;">
                <strong>${box.name}</strong>
                <span style="font-size: 12px; color: #666;">${Math.round(box.width)}x${Math.round(box.height)}</span>
              </div>
              ${this._selectedBoxId === box.id ? html`
                <div style="margin-top: 1rem; border-top: 1px solid #eee; padding-top: 0.5rem;">
                  <div style="margin-bottom: 0.5rem;">
                    <label style="display: block; font-size: 10px; color: #999;">NAME</label>
                    <input 
                      style="width: 100%; box-sizing: border-box;"
                      .value="${box.name}"
                      @input="${(e) => this._updateBox(box.id, { name: e.target.value })}"
                    >
                  </div>
                  <div style="margin-bottom: 0.5rem;">
                    <label style="display: block; font-size: 10px; color: #999;">COLOUR</label>
                    <div style="display: flex; gap: 4px; margin-top: 4px;">
                      ${['BLACK', 'WHITE', 'RED'].map(c => html`
                        <div 
                          style="
                            width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc;
                            background-color: ${c === 'RED' ? 'red' : c === 'BLACK' ? 'black' : 'white'};
                            cursor: pointer;
                            box-shadow: ${box.colour === c ? '0 0 0 2px #ff9800' : 'none'};
                          "
                          @click="${() => this._updateBox(box.id, { colour: c })}"
                        ></div>
                      `)}
                    </div>
                  </div>
                  <button 
                    @click="${() => this._handleDeleteBox(box.id)}"
                    style="background: #f44336; font-size: 10px; padding: 2px 6px;"
                  >Delete Object</button>
                </div>
              ` : ''}
            </div>
          `)}
        </div>

        <div class="editor-container">
          <div class="toolbar">
            <span>Editor: ${this._activeLayout.name}</span>
            <span style="color: #666; font-size: 12px;">(5px Grid Snapping Enabled)</span>
          </div>
          <layout-editor
            .width_px="${this._activeLayout.width_px}"
            .height_px="${this._activeLayout.height_px}"
            .boxes="${this._activeLayout.boxes}"
            ._selectedId="${this._selectedBoxId}"
            @layout-changed="${(e) => {
              this._activeLayout.boxes = e.detail.boxes;
              this.requestUpdate();
            }}"
          ></layout-editor>
        </div>
      </main>
    `;
  }
}

customElements.define('app-root', AppRoot);
