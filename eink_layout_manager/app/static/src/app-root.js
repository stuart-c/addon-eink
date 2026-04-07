import { LitElement, html, css } from 'lit';
import { api } from './services/HaApiClient.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #03a9f4;
    }
    .status {
      padding: 0.5rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .connected {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .error {
      background-color: #ffebee;
      color: #c62828;
    }
    .layout-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
    }
  `;

  static properties = {
    _connected: { type: Boolean },
    _layouts: { type: Array },
  };

  constructor() {
    super();
    this._connected = false;
    this._layouts = [];
  }

  firstUpdated() {
    this._checkBackend();
    this._loadLayouts();
  }

  async _checkBackend() {
    this._connected = await api.ping();
  }

  async _loadLayouts() {
    try {
      this._layouts = await api.getLayouts();
    } catch (e) {
      console.error('Failed to load layouts', e);
    }
  }

  render() {
    return html`
      <h1>eInk Layout Manager</h1>
      
      <div class="status ${this._connected ? 'connected' : 'error'}">
        Backend Status: ${this._connected ? 'Connected' : 'Disconnected'}
      </div>

      <section>
        <h2>Recent Layouts</h2>
        ${this._layouts.length === 0 
          ? html`<p>No layouts found.</p>`
          : this._layouts.map(layout => html`
              <div class="layout-card">
                <strong>${layout.name}</strong> (${layout.width_px}x${layout.height_px})
              </div>
            `)
        }
      </section>
    `;
  }
}

customElements.define('app-root', AppRoot);
