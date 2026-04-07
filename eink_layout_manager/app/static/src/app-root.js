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
  };

  constructor() {
    super();
    this._connected = false;
    this._layouts = [];
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
    this.requestUpdate();
  }

  render() {
    return html`
      <header>
        <div><strong>eInk Layout Manager</strong></div>
        <div>Status: ${this._connected ? 'Connected' : 'Offline'}</div>
      </header>

      <main>
        <div class="sidebar">
          <h3>Objects</h3>
          ${this._activeLayout.boxes.map(box => html`
            <div style="margin-bottom: 0.5rem; padding: 0.5rem; border: 1px solid #eee;">
              ${box.name} (${Math.round(box.x)}, ${Math.round(box.y)})
            </div>
          `)}
          <button @click="${this._handleAddBox}">Add Box</button>
        </div>

        <div class="editor-container">
          <div class="toolbar">
            <span>Editor: ${this._activeLayout.name}</span>
          </div>
          <layout-editor
            .width_px="${this._activeLayout.width_px}"
            .height_px="${this._activeLayout.height_px}"
            .boxes="${this._activeLayout.boxes}"
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
