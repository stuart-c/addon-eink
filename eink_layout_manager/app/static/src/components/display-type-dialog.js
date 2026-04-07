import { LitElement, html, css } from 'lit';

/**
 * A dialog component for creating and editing eInk Display Types.
 */
export class DisplayTypeDialog extends LitElement {
  static styles = css`
    dialog {
      border: none;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 400px;
      max-width: 90vw;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    .container {
      padding: 1.5rem;
    }
    header {
      margin-bottom: 1rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    h2 { margin: 0; font-size: 1.25rem; }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .row {
      display: flex;
      gap: 1rem;
    }
    .row > * { flex: 1; }
    footer {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }
    .primary { background: #03a9f4; color: white; }
    .secondary { background: #eee; }
  `;

  static properties = {
    displayType: { type: Object },
    isNew: { type: Boolean }
  };

  constructor() {
    super();
    this.displayType = this._getDefaultDisplayType();
    this.isNew = true;
  }

  _getDefaultDisplayType() {
    return {
      id: '',
      name: 'New Display',
      width_mm: 158,
      height_mm: 98,
      width_px: 800,
      height_px: 480,
      colour_type: 'MONO',
      frame: { thickness_mm: 5, colour: '#000000' },
      mat: { thickness_mm: 10, colour: '#ffffff' }
    };
  }

  show(displayType = null) {
    if (displayType) {
      this.displayType = JSON.parse(JSON.stringify(displayType));
      this.isNew = false;
    } else {
      this.displayType = this._getDefaultDisplayType();
      this.isNew = true;
    }
    this.renderRoot.querySelector('dialog').showModal();
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this.isNew && !this.displayType.id) {
       this.displayType.id = this.displayType.name.toLowerCase().replace(/\s+/g, '_');
    }
    this.dispatchEvent(new CustomEvent('save', { detail: { displayType: this.displayType } }));
    this.close();
  }

  render() {
    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>${this.isNew ? 'Add Display Type' : 'Edit Display Type'}</h2>
          </header>
          <form @submit="${this._handleSubmit}">
            <div class="form-group">
              <label>Name</label>
              <input 
                type="text" 
                required 
                .value="${this.displayType.name}"
                @input="${e => this.displayType.name = e.target.value}"
              >
            </div>
            
            <div class="row">
              <div class="form-group">
                <label>Width (mm)</label>
                <input type="number" required .value="${this.displayType.width_mm}" @input="${e => this.displayType.width_mm = parseInt(e.target.value)}">
              </div>
              <div class="form-group">
                <label>Height (mm)</label>
                <input type="number" required .value="${this.displayType.height_mm}" @input="${e => this.displayType.height_mm = parseInt(e.target.value)}">
              </div>
            </div>

            <div class="row">
              <div class="form-group">
                <label>Width (px)</label>
                <input type="number" required .value="${this.displayType.width_px}" @input="${e => this.displayType.width_px = parseInt(e.target.value)}">
              </div>
              <div class="form-group">
                <label>Height (px)</label>
                <input type="number" required .value="${this.displayType.height_px}" @input="${e => this.displayType.height_px = parseInt(e.target.value)}">
              </div>
            </div>

            <div class="form-group">
              <label>Colour Type</label>
              <select .value="${this.displayType.colour_type}" @change="${e => this.displayType.colour_type = e.target.value}">
                <option value="MONO">MONO (B/W)</option>
                <option value="BWR">BWR (Red)</option>
                <option value="BWY">BWY (Yellow)</option>
                <option value="BWRY">BWRY (Red/Yellow)</option>
                <option value="BWGBRY">BWGBRY (Spectra 6)</option>
                <option value="GRAYSCALE_4">Grayscale (4-bit)</option>
              </select>
            </div>

            <div class="row">
              <div class="form-group">
                <label>Frame (mm)</label>
                <input type="number" .value="${this.displayType.frame.thickness_mm}" @input="${e => this.displayType.frame.thickness_mm = parseInt(e.target.value)}">
              </div>
              <div class="form-group">
                <label>Frame Color</label>
                <input type="color" .value="${this.displayType.frame.colour}" @input="${e => this.displayType.frame.colour = e.target.value}">
              </div>
            </div>

            <footer>
              <button type="button" class="secondary" @click="${this.close}">Cancel</button>
              <button type="submit" class="primary">Save Parameters</button>
            </footer>
          </form>
        </div>
      </dialog>
    `;
  }
}

customElements.define('display-type-dialog', DisplayTypeDialog);
