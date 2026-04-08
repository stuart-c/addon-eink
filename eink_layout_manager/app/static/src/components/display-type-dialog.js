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
    
    .section-header {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      padding-bottom: 4px;
      border-bottom: 1px dashed #ddd;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    .radio-group {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      cursor: pointer;
      text-transform: none;
      font-weight: normal;
      color: #333;
    }
    .radio-option input {
      width: auto;
    }
  `;

  static properties = {
    displayType: { type: Object },
    isNew: { type: Boolean },
    _frameType: { state: true },
    _matType: { state: true }
  };

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
      
      this._frameType = this.displayType.frame ? 'standard' : 'none';
      if (!this.displayType.mat) {
        this._matType = 'none';
      } else if (this.displayType.mat.horizontal_mm !== undefined) {
        this._matType = 'custom';
      } else {
        this._matType = 'uniform';
      }
    } else {
      this.displayType = this._getDefaultDisplayType();
      this.isNew = true;
      this._frameType = 'standard';
      this._matType = 'uniform';
    }
    this.renderRoot.querySelector('dialog').showModal();
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
  }

  _handleSubmit(e) {
    e.preventDefault();
    
    // Auto-generate ID if missing
    if (this.isNew && !this.displayType.id) {
       this.displayType.id = this.displayType.name.toLowerCase().replace(/\s+/g, '_');
    }

    // Sanitize Frame based on UI selection
    if (this._frameType === 'none') {
      delete this.displayType.frame;
    }

    // Sanitize Mat based on UI selection
    if (this._matType === 'none') {
      delete this.displayType.mat;
    } else if (this._matType === 'uniform') {
      // Ensure only uniform properties exist
      const { thickness_mm, colour } = this.displayType.mat;
      this.displayType.mat = { thickness_mm, colour };
    } else if (this._matType === 'custom') {
      // Ensure only custom properties exist
      const { horizontal_mm, vertical_mm, colour } = this.displayType.mat;
      this.displayType.mat = { horizontal_mm, vertical_mm, colour };
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

            <!-- Frame Section -->
            <div class="section-header">Frame Settings</div>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="frameType" value="none" ?checked="${this._frameType === 'none'}" @change="${() => this._frameType = 'none'}"> None
              </label>
              <label class="radio-option">
                <input type="radio" name="frameType" value="standard" ?checked="${this._frameType === 'standard'}" @change="${() => { this._frameType = 'standard'; if (!this.displayType.frame) this.displayType.frame = { thickness_mm: 5, colour: '#000000' }}}"> Standard
              </label>
            </div>

            ${this._frameType === 'standard' ? html`
              <div class="row">
                <div class="form-group">
                  <label>Thickness (mm)</label>
                  <input type="number" .value="${this.displayType.frame.thickness_mm}" @input="${e => this.displayType.frame.thickness_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Frame Color</label>
                  <input type="color" .value="${this.displayType.frame.colour}" @input="${e => this.displayType.frame.colour = e.target.value}">
                </div>
              </div>
            ` : ''}

            <!-- Mat Section -->
            <div class="section-header">Mat Settings</div>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="matType" value="none" ?checked="${this._matType === 'none'}" @change="${() => this._matType = 'none'}"> None
              </label>
              <label class="radio-option">
                <input type="radio" name="matType" value="uniform" ?checked="${this._matType === 'uniform'}" @change="${() => { this._matType = 'uniform'; if (!this.displayType.mat) this.displayType.mat = { thickness_mm: 10, colour: '#ffffff' }}}"> Uniform
              </label>
              <label class="radio-option">
                <input type="radio" name="matType" value="custom" ?checked="${this._matType === 'custom'}" @change="${() => { this._matType = 'custom'; if (!this.displayType.mat) this.displayType.mat = { horizontal_mm: 10, vertical_mm: 10, colour: '#ffffff' }}}"> Custom
              </label>
            </div>

            ${this._matType !== 'none' ? html`
              <div class="row">
                ${this._matType === 'uniform' ? html`
                  <div class="form-group">
                    <label>Thickness (mm)</label>
                    <input type="number" .value="${this.displayType.mat.thickness_mm || 0}" @input="${e => { this.displayType.mat.thickness_mm = parseInt(e.target.value); delete this.displayType.mat.horizontal_mm; delete this.displayType.mat.vertical_mm; }}">
                  </div>
                ` : html`
                  <div class="form-group">
                    <label>Horizontal (mm)</label>
                    <input type="number" .value="${this.displayType.mat.horizontal_mm || 0}" @input="${e => { this.displayType.mat.horizontal_mm = parseInt(e.target.value); delete this.displayType.mat.thickness_mm; }}">
                  </div>
                  <div class="form-group">
                    <label>Vertical (mm)</label>
                    <input type="number" .value="${this.displayType.mat.vertical_mm || 0}" @input="${e => { this.displayType.mat.vertical_mm = parseInt(e.target.value); delete this.displayType.mat.thickness_mm; }}">
                  </div>
                `}
                <div class="form-group">
                  <label>Mat Color</label>
                  <input type="color" .value="${this.displayType.mat.colour}" @input="${e => this.displayType.mat.colour = e.target.value}">
                </div>
              </div>
            ` : ''}

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
