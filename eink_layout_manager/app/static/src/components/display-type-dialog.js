import { LitElement, html, css } from 'lit';

/**
 * A dialog component for creating and editing eInk Display Types.
 */
export class DisplayTypeDialog extends LitElement {
  static styles = css`
    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      width: 800px;
      max-width: 95vw;
      background: #fff;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
    }
    .container {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #eee;
    }
    h2 { margin: 0; font-size: 1.1rem; color: #333; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .main-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      overflow: hidden;
    }

    form {
      padding: 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
      border-right: 1px solid #eee;
    }

    .preview-column {
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1.5rem;
      gap: 1.5rem;
    }

    .preview-canvas {
      width: 300px;
      height: 300px;
      background: #e9ecef;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      position: relative;
      overflow: hidden;
    }

    .hardware-assembly {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .preview-layer {
      position: absolute;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      transition: all 0.2s ease-out;
    }

    .preview-frame { z-index: 10; border-radius: 2px; }
    .preview-mat { z-index: 20; border-radius: 1px; }
    .preview-display { 
      z-index: 30; 
      background: #fff; 
      border: 1px solid rgba(0,0,0,0.1);
    }

    .preview-label {
      font-size: 11px;
      font-weight: bold;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #666;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select {
      width: 100%;
      padding: 10px;
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
      gap: 1rem;
    }
    .row > * { flex: 1; }
    
    footer {
      margin-top: auto;
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      background: #fff;
    }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: filter 0.2s;
    }
    button:hover { filter: brightness(0.95); }
    .primary { background: #03a9f4; color: white; }
    .secondary { background: #eee; color: #555; }
    
    .section-header {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 6px;
      border-bottom: 2px solid #f0f0f0;
      font-size: 13px;
      font-weight: 800;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .radio-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.25rem;
      background: #f8f9fa;
      padding: 4px;
      border-radius: 8px;
    }
    .radio-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13px;
      padding: 8px;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .radio-option:has(input:checked) {
      background: #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      color: #03a9f4;
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

  _renderPreview() {
    const dWidth = this.displayType.width_mm || 0;
    const dHeight = this.displayType.height_mm || 0;

    let matTop = 0, matBottom = 0, matLeft = 0, matRight = 0;
    if (this._matType === 'uniform') {
      matTop = matBottom = matLeft = matRight = (this.displayType.mat?.thickness_mm || 0);
    } else if (this._matType === 'custom') {
      matTop = matBottom = (this.displayType.mat?.vertical_mm || 0);
      matLeft = matRight = (this.displayType.mat?.horizontal_mm || 0);
    }

    const frameThickness = this._frameType === 'standard' ? (this.displayType.frame?.thickness_mm || 0) : 0;

    const totalWidth = dWidth + matLeft + matRight + (frameThickness * 2);
    const totalHeight = dHeight + matTop + matBottom + (frameThickness * 2);

    const maxPreviewDim = 260; 
    const scale = totalWidth > 0 && totalHeight > 0 
      ? maxPreviewDim / Math.max(totalWidth, totalHeight) 
      : 1;

    const assemblyStyle = `width: ${totalWidth * scale}px; height: ${totalHeight * scale}px;`;
    
    const frameStyle = this._frameType === 'standard' 
      ? `width: 100%; height: 100%; background: ${this.displayType.frame.colour};`
      : 'display: none;';

    const matStyle = this._matType !== 'none'
      ? `
        top: ${frameThickness * scale}px; 
        left: ${frameThickness * scale}px; 
        width: ${(dWidth + matLeft + matRight) * scale}px; 
        height: ${(dHeight + matTop + matBottom) * scale}px; 
        background: ${this.displayType.mat.colour};
      `
      : 'display: none;';

    const displayStyle = `
      top: ${(frameThickness + matTop) * scale}px; 
      left: ${(frameThickness + matLeft) * scale}px; 
      width: ${dWidth * scale}px; 
      height: ${dHeight * scale}px;
    `;

    return html`
      <div class="hardware-assembly" style="${assemblyStyle}">
        <div class="preview-layer preview-frame" style="${frameStyle}"></div>
        <div class="preview-layer preview-mat" style="${matStyle}"></div>
        <div class="preview-layer preview-display" style="${displayStyle}"></div>
      </div>
    `;
  }

  render() {
    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>${this.isNew ? 'Add Display Type' : 'Edit Display Type'}</h2>
          </header>
          
          <div class="main-layout">
            <form @submit="${this._handleSubmit}" @input="${() => this.requestUpdate()}">
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
                <select .value="${this.displayType.colour_type}" @change="${e => { this.displayType.colour_type = e.target.value; this.requestUpdate(); }}">
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
                  <input type="radio" name="frameType" value="none" ?checked="${this._frameType === 'none'}" @change="${() => { this._frameType = 'none'; this.requestUpdate(); }}"> None
                </label>
                <label class="radio-option">
                  <input type="radio" name="frameType" value="standard" ?checked="${this._frameType === 'standard'}" @change="${() => { this._frameType = 'standard'; if (!this.displayType.frame) this.displayType.frame = { thickness_mm: 5, colour: '#000000' }; this.requestUpdate(); }}"> Standard
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
                  <input type="radio" name="matType" value="none" ?checked="${this._matType === 'none'}" @change="${() => { this._matType = 'none'; this.requestUpdate(); }}"> None
                </label>
                <label class="radio-option">
                  <input type="radio" name="matType" value="uniform" ?checked="${this._matType === 'uniform'}" @change="${() => { this._matType = 'uniform'; if (!this.displayType.mat) this.displayType.mat = { thickness_mm: 10, colour: '#ffffff' }; this.requestUpdate(); }}"> Uniform
                </label>
                <label class="radio-option">
                  <input type="radio" name="matType" value="custom" ?checked="${this._matType === 'custom'}" @change="${() => { this._matType = 'custom'; if (!this.displayType.mat) this.displayType.mat = { horizontal_mm: 10, vertical_mm: 10, colour: '#ffffff' }; this.requestUpdate(); }}"> Custom
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

              <div style="display: none;">
                <button id="real-submit" type="submit"></button>
              </div>
            </form>

            <div class="preview-column">
              <div class="preview-label">Live Preview</div>
              <div class="preview-canvas">
                ${this._renderPreview()}
              </div>
              <div class="preview-label">
                ${this.displayType.width_mm} x ${this.displayType.height_mm} mm
              </div>
            </div>
          </div>

          <footer>
            <button type="button" class="secondary" @click="${this.close}">Cancel</button>
            <button type="button" class="primary" @click="${() => this.shadowRoot.getElementById('real-submit').click()}">Save Parameters</button>
          </footer>
        </div>
      </dialog>
    `;
  }
}

customElements.define('display-type-dialog', DisplayTypeDialog);
