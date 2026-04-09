import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import type { DisplayType } from '../services/HaApiClient';
import { commonStyles } from '../styles/common-styles';
import './shared/hardware-preview';

/**
 * A dialog component for creating and editing eInk Display Types.
 */
@customElement('display-type-dialog')
export class DisplayTypeDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      width: 1000px;
      max-width: 98vw;
      height: 80vh;
      background: #fff;
      overflow: hidden;
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
      overflow: hidden;
    }
    header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #eee;
    }
    h2 { margin: 0; font-size: 1.1rem; color: #333; text-transform: uppercase; letter-spacing: 0.5px; }
    .main-layout {
      display: grid;
      grid-template-columns: 220px 1fr 340px;
      grid-template-rows: 1fr;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .list-sidebar {
      background: #f8f9fa;
      border-right: 1px solid #eee;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-item {
      padding: 12px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: #fff;
    }

    .sidebar-item:hover { background: #f0faff; }
    .sidebar-item.selected { 
      background: #e1f5fe; 
      border-left: 4px solid var(--primary-colour);
      padding-left: 8px;
    }

    .sidebar-thumbnail {
      width: 80px;
      height: 60px;
      background: #eee;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: var(--shadow-small);
    }

    .sidebar-name {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-colour);
      text-align: center;
      word-break: break-all;
    }

    .sidebar-item.add-new {
      padding: 1.5rem 1rem;
      border-top: 1px solid #eee;
      background: #fafafa;
      flex-direction: row;
      justify-content: center;
      color: var(--primary-colour);
      font-weight: 600;
      flex-shrink: 0;
    }
    .sidebar-item.add-new:hover { background: #f0faff; }
    .sidebar-item.add-new.selected { background: #e1f5fe; }

    form {
      padding: 1.5rem;
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
      overflow: hidden;
      position: relative;
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

    .preview-label {
      font-size: 11px;
      font-weight: bold;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .summary-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #eee;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      max-height: 80%;
    }
    .summary-panel.collapsed {
      transform: translateY(calc(100% - 44px));
    }
    .summary-toggle {
      padding: 12px 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: #fff;
      user-select: none;
    }
    .summary-toggle:hover {
      background: #f0faff;
    }
    .summary-toggle .preview-label {
      margin: 0;
    }
    .summary-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
      overflow-y: auto;
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
    .danger { background: #d32f2f; color: white; }
    
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
    `
  ];

  @property({ type: Object }) displayType!: DisplayType;
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Boolean }) isNew = true;
  @property({ type: Object }) confirmDialog!: any; // Reference to app-root's confirm-dialog if needed, or we use events

  @state() private _showSummary = false;

  private _PRESETS = [
    { name: 'White', colour: '#ffffff' },
    { name: 'Black', colour: '#000000' },
    { name: 'Brown', colour: '#5d4037' },
    { name: 'Silver', colour: '#c0c0c0' }
  ];

  private _getDefaultDisplayType(): DisplayType {
    return {
      id: '',
      name: '',
      width_mm: 0,
      height_mm: 0,
      panel_width_mm: 0,
      panel_height_mm: 0,
      width_px: 0,
      height_px: 0,
      colour_type: 'MONO',
      frame: { border_width_mm: 0, colour: '#000000' },
      mat: { colour: '#ffffff' }
    };
  }

  async show(displayType: DisplayType | null = null) {
    if (displayType) {
      this.displayType = JSON.parse(JSON.stringify(displayType));
      this.isNew = false;
    } else {
      this.displayType = this._getDefaultDisplayType();
      this.isNew = true;
    }
    await this.updateComplete;
    const dialog = this.shadowRoot?.querySelector('dialog');
    dialog?.showModal();
  }

  close() {
    const dialog = this.shadowRoot?.querySelector('dialog');
    dialog?.close();
  }

  private _isDirty(): boolean {
    if (this.isNew) {
      const defaultValue = this._getDefaultDisplayType();
      return JSON.stringify(this.displayType) !== JSON.stringify(defaultValue);
    }
    const original = this.displayTypes.find(dt => dt.id === this.displayType.id);
    if (!original) return true;
    return JSON.stringify(this.displayType) !== JSON.stringify(original);
  }

  private async _handleSelect(id: string | null) {
    if (this.displayType.id === id && !this.isNew) return;
    if (id === null && this.isNew) return;

    if (this._isDirty()) {
      const event = new CustomEvent('request-confirmation', {
        detail: {
          config: {
            title: 'Unsaved Changes',
            message: `You have unsaved changes to "${this.displayType.name}". What would you like to do?`,
            buttons: [
              { text: 'Save', value: 'save', type: 'primary' },
              { text: 'Discard', value: 'discard', type: 'danger' },
              { text: 'Cancel', value: 'cancel', type: 'secondary' }
            ]
          },
          callback: async (choice: string) => {
            if (choice === 'save') {
              const form = this.shadowRoot?.querySelector('form');
              if (form?.checkValidity()) {
                this._handleSubmit(new Event('submit'));
                this._switchTo(id);
              } else {
                form?.reportValidity();
              }
            } else if (choice === 'discard') {
              this._switchTo(id);
            }
          }
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    } else {
      this._switchTo(id);
    }
  }

  private _switchTo(id: string | null) {
    if (id === null) {
      this.displayType = this._getDefaultDisplayType();
      this.isNew = true;
    } else {
      const found = this.displayTypes.find(dt => dt.id === id);
      if (found) {
        this.displayType = JSON.parse(JSON.stringify(found));
        this.isNew = false;
      }
    }
    this.requestUpdate();
  }

  private _handleDelete() {
    if (!this.displayType || this.isNew) return;
    this.dispatchEvent(new CustomEvent('delete-display-type', { detail: this.displayType }));
    // After delete, the displayTypes array will update via app-root, but we should probably switch to first item or new
    if (this.displayTypes.length > 1) {
      const next = this.displayTypes.find(dt => dt.id !== this.displayType.id);
      if (next) this._switchTo(next.id);
    } else {
      this._switchTo(null);
    }
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    
    // Auto-generate ID if missing
    if (this.isNew && !this.displayType.id) {
       this.displayType.id = this.displayType.name.toLowerCase().replace(/\s+/g, '_');
    }

    this.dispatchEvent(new CustomEvent('save', { detail: { displayType: this.displayType } }));
    this.close();
  }

  private _renderColourPicker(label: string, value: string, onUpdate: (colour: string) => void) {
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
            .value="${live(value)}" 
            @input="${(e: any) => onUpdate(e.target.value)}"
          >
          <div class="hex-value">${value}</div>
        </div>
      </div>
    `;
  }

  private _formatDim(val: number): string {
    return parseFloat(val.toFixed(1)).toString();
  }

  render() {
    if (!this.displayType) return html``;

    const frameW = this.displayType.width_mm || 0;
    const frameH = this.displayType.height_mm || 0;
    const border = this.displayType.frame?.border_width_mm || 0;
    const panelW = this.displayType.panel_width_mm || 0;
    const panelH = this.displayType.panel_height_mm || 0;

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    const cutoutX = (matW - panelW) / 2;
    const cutoutY = (matH - panelH) / 2;

    const maxPreviewDim = 240; 
    const scale = frameW > 0 && frameH > 0 
      ? maxPreviewDim / Math.max(frameW, frameH) 
      : 1;

    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>Manage Display Types</h2>
          </header>
          
          <div class="main-layout">
            <div class="list-sidebar">
              ${this.displayTypes.map(dt => {
                const dtScale = 60 / Math.max(dt.width_mm, dt.height_mm);
                return html`
                  <div 
                    class="sidebar-item ${this.displayType.id === dt.id && !this.isNew ? 'selected' : ''}" 
                    @click="${() => this._handleSelect(dt.id)}"
                  >
                    <div class="sidebar-thumbnail">
                      <hardware-preview
                        .width_mm="${dt.width_mm}"
                        .height_mm="${dt.height_mm}"
                        .border_width_mm="${dt.frame.border_width_mm}"
                        .panel_width_mm="${dt.panel_width_mm}"
                        .panel_height_mm="${dt.panel_height_mm}"
                        .frame_colour="${dt.frame.colour}"
                        .mat_colour="${dt.mat.colour}"
                        .scale="${dtScale}"
                      ></hardware-preview>
                    </div>
                    <span class="sidebar-name">${dt.name}</span>
                  </div>
                `;
              })}
              
              <div 
                class="sidebar-item add-new ${this.isNew ? 'selected' : ''}" 
                @click="${() => this._handleSelect(null)}"
              >
                <span class="material-icons" style="margin-right: 8px;">add_circle_outline</span>
                Add New Display
              </div>
            </div>

            <form id="display-type-form" @submit="${this._handleSubmit}" @input="${() => this.requestUpdate()}">
              <div class="form-group">
                <label>Identifier/Name</label>
                <input 
                  type="text" 
                  required 
                  .value="${live(this.displayType?.name || '')}"
                  @input="${(e: any) => this.displayType.name = e.target.value}"
                >
              </div>

              <!-- Device Dimensions Section -->
              <div class="section-header">Device Dimensions</div>
              <div class="row">
                <div class="form-group">
                  <label>Frame Outer Width (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.width_mm || 0)}" @input="${(e: any) => this.displayType.width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Frame Outer Height (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.height_mm || 0)}" @input="${(e: any) => this.displayType.height_mm = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Display Panel Width (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.panel_width_mm || 0)}" @input="${(e: any) => this.displayType.panel_width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Display Panel Height (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.panel_height_mm || 0)}" @input="${(e: any) => this.displayType.panel_height_mm = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="form-group">
                <label>Frame Border Width (mm)</label>
                <input type="number" required .value="${live(this.displayType?.frame?.border_width_mm || 0)}" @input="${(e: any) => this.displayType.frame.border_width_mm = parseInt(e.target.value)}">
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Resolution Width (px)</label>
                  <input type="number" required .value="${live(this.displayType?.width_px || 0)}" @input="${(e: any) => this.displayType.width_px = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Resolution Height (px)</label>
                  <input type="number" required .value="${live(this.displayType?.height_px || 0)}" @input="${(e: any) => this.displayType.height_px = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="form-group">
                <label>Colour Type</label>
                <select .value="${live(this.displayType?.colour_type || 'MONO')}" @change="${(e: any) => { this.displayType.colour_type = e.target.value; this.requestUpdate(); }}">
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
                <hardware-preview
                  .width_mm="${this.displayType.width_mm}"
                  .height_mm="${this.displayType.height_mm}"
                  .border_width_mm="${this.displayType.frame.border_width_mm}"
                  .panel_width_mm="${this.displayType.panel_width_mm}"
                  .panel_height_mm="${this.displayType.panel_height_mm}"
                  .frame_colour="${this.displayType.frame.colour}"
                  .mat_colour="${this.displayType.mat.colour}"
                  .scale="${scale}"
                ></hardware-preview>
              </div>

              <div class="summary-panel ${this._showSummary ? '' : 'collapsed'}">
                <div class="summary-toggle" @click="${() => this._showSummary = !this._showSummary}">
                  <span class="preview-label">Dimension Summary</span>
                  <span class="material-icons">${this._showSummary ? 'expand_more' : 'expand_less'}</span>
                </div>
                <div class="summary-content">
                  <table class="summary-table">
                    <tr><th>Overall Frame</th><td><span class="val">${this._formatDim(frameW)} x ${this._formatDim(frameH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Mat (Aperture)</th><td><span class="val">${this._formatDim(matW)} x ${this._formatDim(matH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Display Panel</th><td><span class="val">${this._formatDim(panelW)} x ${this._formatDim(panelH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Cutout Position</th><td><span class="val">${this._formatDim(cutoutX)} x ${this._formatDim(cutoutY)}</span><span class="unit">mm</span></td></tr>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <button 
              type="button" 
              class="danger" 
              style="margin-right: auto;" 
              ?hidden="${this.isNew}" 
              @click="${this._handleDelete}"
            >Delete</button>
            <button type="button" class="secondary" @click="${this.close}">Close</button>
            <button type="button" class="primary" @click="${() => (this.shadowRoot?.getElementById('real-submit') as HTMLButtonElement).click()}">Save Display Type</button>
          </footer>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'display-type-dialog': DisplayTypeDialog;
  }
}
