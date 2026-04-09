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
    .swatch-group {
      display: flex;
      gap: 8px;
      margin-top: 4px;
      margin-bottom: 8px;
    }
    .swatch {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: all 0.2s ease;
      position: relative;
    }
    .swatch:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-color: #03a9f4;
    }
    .swatch.selected {
      border: 2px solid #03a9f4;
      box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2);
    }
    .colour-input-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    input[type="color"] {
      width: 40px;
      height: 34px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      padding: 2px;
    }
    .hex-value {
      font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
      font-size: 13px;
      color: #555;
      text-transform: uppercase;
      font-weight: 600;
      flex: 1;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 12px;
    }
    .summary-table th, .summary-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }
    .summary-table th {
      background: #f8f9fa;
      color: #666;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 40%;
    }
    .summary-table tr:last-child td, .summary-table tr:last-child th {
      border-bottom: none;
    }
    .summary-table .val {
      font-weight: 600;
      color: #333;
    }
    .summary-table .unit {
      color: #aaa;
      margin-left: 2px;
      font-weight: normal;
    }
  `;

  static properties = {
    displayType: { type: Object },
    isNew: { type: Boolean },
    _frameType: { state: true },
    _matType: { state: true }
  };

  _PRESETS = [
    { name: 'White', colour: '#ffffff' },
    { name: 'Black', colour: '#000000' },
    { name: 'Brown', colour: '#5d4037' },
    { name: 'Silver', colour: '#c0c0c0' }
  ];

  _getDefaultDisplayType() {
    return {
      id: '',
      name: 'New Display',
      width_mm: 300,
      height_mm: 200,
      panel_width_mm: 158,
      panel_height_mm: 98,
      width_px: 800,
      height_px: 480,
      colour_type: 'MONO',
      frame: { border_width_mm: 15, colour: '#000000' },
      mat: { colour: '#ffffff' }
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
    dialog.showModal();
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

    this.dispatchEvent(new CustomEvent('save', { detail: { displayType: this.displayType } }));
    this.close();
  }

  _renderPreview() {
    const frameW = this.displayType.width_mm || 0;
    const frameH = this.displayType.height_mm || 0;
    const border = this.displayType.frame?.border_width_mm || 0;
    const panelW = this.displayType.panel_width_mm || 0;
    const panelH = this.displayType.panel_height_mm || 0;

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    
    const matL = (matW - panelW) / 2;
    const matT = (matH - panelH) / 2;

    const maxPreviewDim = 240; 
    const scale = frameW > 0 && frameH > 0 
      ? maxPreviewDim / Math.max(frameW, frameH) 
      : 1;

    const assemblyStyle = `width: ${frameW * scale}px; height: ${frameH * scale}px;`;
    const frameStyle = `width: 100%; height: 100%; background: ${this.displayType.frame?.colour || '#000'};`;
    const matStyle = `
      top: ${border * scale}px; 
      left: ${border * scale}px; 
      width: ${matW * scale}px; 
      height: ${matH * scale}px; 
      background: ${this.displayType.mat?.colour || '#fff'};
    `;
    const displayStyle = `
      top: ${(border + matT) * scale}px; 
      left: ${(border + matL) * scale}px; 
      width: ${panelW * scale}px; 
      height: ${panelH * scale}px;
    `;

    return html`
      <div class="hardware-assembly" style="${assemblyStyle}">
        <div class="preview-layer preview-frame" style="${frameStyle}"></div>
        <div class="preview-layer preview-mat" style="${matStyle}"></div>
        <div class="preview-layer preview-display" style="${displayStyle}"></div>
      </div>
    `;
  }

  _renderColourPicker(label, value, onUpdate) {
    return html`
      <div class="form-group">
        <label>${label}</label>
        <div class="swatch-group">
          ${this._PRESETS.map(p => html`
            <div 
              class="swatch ${value.toLowerCase() === p.colour.toLowerCase() ? 'selected' : ''}" 
              style="background: ${p.colour}"
              title="${p.name}"
              @click="${() => onUpdate(p.colour)}"
            ></div>
          `)}
        </div>
        <div class="colour-input-container">
          <input 
            type="color" 
            .value="${value}" 
            @input="${e => onUpdate(e.target.value)}"
          >
          <div class="hex-value">${value}</div>
        </div>
      </div>
    `;
  }

  render() {
    const frameW = this.displayType.width_mm || 0;
    const frameH = this.displayType.height_mm || 0;
    const border = this.displayType.frame?.border_width_mm || 0;
    const panelW = this.displayType.panel_width_mm || 0;
    const panelH = this.displayType.panel_height_mm || 0;

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    const cutoutX = (matW - panelW) / 2;
    const cutoutY = (matH - panelH) / 2;

    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>${this.isNew ? 'Add Display Type' : 'Edit Display Type'}</h2>
          </header>
          
          <div class="main-layout">
            <form @submit="${this._handleSubmit}" @input="${() => this.requestUpdate()}">
              <div class="form-group">
                <label>Identifier/Name</label>
                <input 
                  type="text" 
                  required 
                  .value="${this.displayType.name}"
                  @input="${e => this.displayType.name = e.target.value}"
                >
              </div>

              <!-- Device Dimensions Section -->
              <div class="section-header">Device Dimensions</div>
              <div class="row">
                <div class="form-group">
                  <label>Frame Outer Width (mm)</label>
                  <input type="number" required .value="${this.displayType.width_mm}" @input="${e => this.displayType.width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Frame Outer Height (mm)</label>
                  <input type="number" required .value="${this.displayType.height_mm}" @input="${e => this.displayType.height_mm = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Display Panel Width (mm)</label>
                  <input type="number" required .value="${this.displayType.panel_width_mm}" @input="${e => this.displayType.panel_width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Display Panel Height (mm)</label>
                  <input type="number" required .value="${this.displayType.panel_height_mm}" @input="${e => this.displayType.panel_height_mm = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="form-group">
                <label>Frame Border Width (mm)</label>
                <input type="number" required .value="${this.displayType.frame.border_width_mm}" @input="${e => this.displayType.frame.border_width_mm = parseInt(e.target.value)}">
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Resolution Width (px)</label>
                  <input type="number" required .value="${this.displayType.width_px}" @input="${e => this.displayType.width_px = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Resolution Height (px)</label>
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
                  <option value="GRAYSCALE_4">Greyscale (4-bit)</option>
                </select>
              </div>

              <div class="section-header">Aesthetics</div>
              <div class="row">
                ${this._renderColourPicker('Frame Colour', this.displayType.frame.colour, (c) => { this.displayType.frame.colour = c; this.requestUpdate(); })}
                ${this._renderColourPicker('Mat Colour', this.displayType.mat.colour, (c) => { this.displayType.mat.colour = c; this.requestUpdate(); })}
              </div>

              <div style="display: none;">
                <button id="real-submit" type="submit"></button>
              </div>
            </form>

            <div class="preview-column">
              <div class="preview-label">Visual Layout</div>
              <div class="preview-canvas">
                ${this._renderPreview()}
              </div>
              
              <div class="preview-label" style="margin-top: 1rem;">Dimension Summary</div>
              <table class="summary-table">
                <tr><th>Overall Frame</th><td><span class="val">${frameW} x ${frameH}</span><span class="unit">mm</span></td></tr>
                <tr><th>Mat (Aperture)</th><td><span class="val">${matW.toFixed(1)} x ${matH.toFixed(1)}</span><span class="unit">mm</span></td></tr>
                <tr><th>Display Panel</th><td><span class="val">${panelW} x ${panelH}</span><span class="unit">mm</span></td></tr>
                <tr><th>Cutout Position</th><td><span class="val">${cutoutX.toFixed(1)} x ${cutoutY.toFixed(1)}</span><span class="unit">mm</span></td></tr>
              </table>
            </div>
          </div>

          <footer>
            <button type="button" class="secondary" @click="${this.close}">Cancel</button>
            <button type="button" class="primary" @click="${() => this.shadowRoot.getElementById('real-submit').click()}">Save Display Type</button>
          </footer>
        </div>
      </dialog>
    `;
  }
}

customElements.define('display-type-dialog', DisplayTypeDialog);
