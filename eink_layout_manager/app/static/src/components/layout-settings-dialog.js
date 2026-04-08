import { LitElement, html, css } from 'lit';

/**
 * A dialog component for configuring layout settings like canvas size and grid snapping.
 */
export class LayoutSettingsDialog extends LitElement {
  static styles = css`
    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      width: 450px;
      max-width: 90vw;
      font-family: inherit;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
    }
    .container {
      padding: 2rem;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
    h2 { margin: 0; font-size: 1.5rem; color: #333; }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #888;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    input:focus {
        outline: none;
        border-color: #03a9f4;
    }
    .row {
      display: flex;
      gap: 1.5rem;
    }
    .row > * { flex: 1; }
    
    .segmented-control {
      display: flex;
      background: #f0f2f5;
      padding: 4px;
      border-radius: 8px;
    }
    .segment {
      flex: 1;
      text-align: center;
      padding: 8px;
      cursor: pointer;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
    }
    .segment:hover {
      color: #333;
    }
    .segment.selected {
      background: white;
      color: #03a9f4;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    footer {
      margin-top: 2.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    .primary { background: #03a9f4; color: white; }
    .primary:hover { background: #0288d1; }
    .secondary { background: #f0f2f5; color: #444; }
    .secondary:hover { background: #e4e6e9; }
  `;

  static properties = {
    layout: { type: Object },
  };

  constructor() {
    super();
    this.layout = {
      name: '',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5
    };
  }

  show(layout) {
    this.layout = JSON.parse(JSON.stringify(layout));
    this.renderRoot.querySelector('dialog').showModal();
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', { detail: { settings: this.layout } }));
    this.close();
  }

  render() {
    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>Layout Settings</h2>
          </header>
          <form @submit="${this._handleSubmit}">
            <div class="form-group">
              <label>Layout Name</label>
              <input 
                type="text" 
                required 
                .value="${this.layout.name}"
                @input="${e => this.layout.name = e.target.value}"
              >
            </div>
            
            <div class="row">
              <div class="form-group">
                <label>Canvas Width (mm)</label>
                <input type="number" required .value="${this.layout.canvas_width_mm}" @input="${e => this.layout.canvas_width_mm = parseInt(e.target.value)}">
              </div>
              <div class="form-group">
                <label>Canvas Height (mm)</label>
                <input type="number" required .value="${this.layout.canvas_height_mm}" @input="${e => this.layout.canvas_height_mm = parseInt(e.target.value)}">
              </div>
            </div>

            <div class="form-group">
              <label>Grid Snapping</label>
              <div class="segmented-control">
                ${[1, 5, 10, 20].map(snap => html`
                  <div 
                    class="segment ${this.layout.grid_snap_mm === snap ? 'selected' : ''}" 
                    @click="${() => { this.layout.grid_snap_mm = snap; this.requestUpdate(); }}"
                  >
                    ${snap}mm
                  </div>
                `)}
              </div>
            </div>

            <footer>
              <button type="button" class="secondary" @click="${this.close}">Cancel</button>
              <button type="submit" class="primary">Apply Settings</button>
            </footer>
          </form>
        </div>
      </dialog>
    `;
  }
}

customElements.define('layout-settings-dialog', LayoutSettingsDialog);
