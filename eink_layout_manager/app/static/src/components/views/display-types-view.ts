import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import type { DisplayType } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/hardware-preview';
import '../shared/section-layout';
import '../layout/yaml-editor';

/**
 * A view component for managing eInk Display Types.
 */
@customElement('display-types-view')
export class DisplayTypesView extends LitElement {
  static styles = [
    commonStyles,
    css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .view-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .toolbar-title {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }
    .toolbar-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      height: 100%;
      overflow: hidden;
    }

    .list-sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-items {
      flex: 1;
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

    .sidebar-item.add-new:hover { background: #f0faff; }
    .sidebar-item.add-new.selected { background: #e1f5fe; }

    form {
      padding: 2rem;
      overflow-y: auto;
      border-right: 1px solid #eee;
      background: white;
    }

    .preview-column {
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1.5rem;
      gap: 1.5rem;
      overflow-y: auto;
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
      background: white;
      border: 1px solid #eee;
      border-radius: 12px;
      box-shadow: var(--shadow-small);
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .summary-content {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 14px;
      transition: all 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-colour);
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
    }
    .row {
      display: flex;
      gap: 1.5rem;
    }
    .row > * { flex: 1; }
    
    button {
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button:hover { filter: brightness(0.95); }
    button:active { transform: translateY(1px); }
    button:disabled { 
      opacity: 0.5; 
      cursor: not-allowed; 
      transform: none;
    }
    .primary { background: var(--primary-colour); color: white; }
    .secondary { background: #eee; color: #555; }
    .danger { background: var(--danger-colour); color: white; }
    
    .section-header {
      margin-top: 2rem;
      margin-bottom: 1.25rem;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
      font-size: 13px;
      font-weight: 800;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .swatch-group {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      margin-bottom: 12px;
    }
    .swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #ddd;
      transition: all 0.2s ease;
      position: relative;
    }
    .swatch:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: var(--primary-colour);
    }
    .swatch.selected {
      border: 2px solid var(--primary-colour);
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.2);
    }
    .colour-input-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid #eee;
    }
    input[type="color"] {
      width: 44px;
      height: 38px;
      border: 1px solid #ddd;
      border-radius: 6px;
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

  @property({ type: Object }) displayType?: DisplayType;
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: String }) selectedId: string | null = null;
  @property({ type: Boolean }) isNew = true;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  @state() private _isDirtyState = false;

  get isDirty() {
    return this._isDirtyState;
  }

  get canDelete() {
    return !this.isNew && !!this.displayType;
  }

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

  connectedCallback() {
    super.connectedCallback();
    this._syncSelection();
    this._updateDirtyState();
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('displayType') || changedProperties.has('displayTypes')) {
      this._updateDirtyState();
      this._updateDeleteState();
    }
    if (changedProperties.has('selectedId')) {
      this._syncSelection();
    }
  }

  private _syncSelection() {
    const found = this.selectedId ? this.displayTypes.find(dt => dt.id === this.selectedId) : null;
    
    if (found) {
      // Switch to existing only if different or currently in 'new' mode
      if (this.displayType?.id !== found.id || this.isNew) {
        this.displayType = JSON.parse(JSON.stringify(found));
        this.isNew = false;
      }
    } else {
      // No valid selection, enter 'new' mode
      if (!this.isNew || !this.displayType) {
        this.displayType = this._getDefaultDisplayType();
        this.isNew = true;
      }
    }
    this.requestUpdate();
  }

  private _updateDeleteState() {
    this.dispatchEvent(new CustomEvent('can-delete-change', {
      detail: { canDelete: !this.isNew && !!this.displayType },
      bubbles: true,
      composed: true
    }));
  }

  private _isDirty(): boolean {
    if (!this.displayType) return false;
    if (this.isNew) {
      const defaultValue = this._getDefaultDisplayType();
      return JSON.stringify(this.displayType) !== JSON.stringify(defaultValue);
    }
    const original = this.displayTypes.find(dt => dt.id === this.displayType?.id);
    if (!original) return true;
    return JSON.stringify(this.displayType) !== JSON.stringify(original);
  }

  private _updateDirtyState() {
    const dirty = this._isDirty();
    if (this._isDirtyState !== dirty) {
      this._isDirtyState = dirty;
      this.dispatchEvent(new CustomEvent('dirty-state-change', {
        detail: { isDirty: dirty },
        bubbles: true,
        composed: true
      }));
    }
  }

  public save() {
     const form = this.shadowRoot?.querySelector('form');
     if (form?.checkValidity()) {
       this._handleSubmit(new Event('submit'));
     } else {
       form?.reportValidity();
     }
  }

  public discard() {
    this._handleSelect(this.isNew ? null : (this.displayType?.id || null));
  }

  private _requestConfirmation(
    config: { title: string, message: string, buttons: any[] },
    callback: (choice: string) => void
  ) {
    this.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: { config, callback },
      bubbles: true,
      composed: true
    }));
  }

  public addNew() {
    this._handleSelect(null);
  }

  private async _handleSelect(id: string | null) {
    if (this.displayType?.id === id && !this.isNew) return;
    if (id === null && this.isNew) return;

    const performSwitch = () => {
      this.dispatchEvent(new CustomEvent('select-display-type', {
        detail: { id },
        bubbles: true,
        composed: true
      }));
    };

    if (this._isDirty()) {
      this._requestConfirmation(
        {
          title: 'Unsaved Changes',
          message: `You have unsaved changes to "${this.displayType?.name}". What would you like to do?`,
          buttons: [
            { text: 'Save', value: 'save', type: 'primary' },
            { text: 'Discard', value: 'discard', type: 'danger' },
            { text: 'Cancel', value: 'cancel', type: 'secondary' }
          ]
        },
        async (choice: string) => {
          if (choice === 'save') {
            const form = this.shadowRoot?.querySelector('form');
            if (form?.checkValidity()) {
              this._handleSubmit(new Event('submit'));
              performSwitch();
            } else {
              form?.reportValidity();
            }
          } else if (choice === 'discard') {
            performSwitch();
          }
        }
      );
    } else {
      performSwitch();
    }
  }


  public requestDelete() {
    this._handleDelete();
  }

  private _handleDelete() {
    if (!this.displayType || this.isNew) return;
    this.dispatchEvent(new CustomEvent('delete-display-type', { detail: this.displayType }));
    
    // Switch to first item or new after delete
    const remaining = this.displayTypes.filter(dt => dt.id !== this.displayType?.id);
    if (remaining.length > 0) {
      this.displayType = JSON.parse(JSON.stringify(remaining[0]));
      this.isNew = false;
    } else {
      this.displayType = this._getDefaultDisplayType();
      this.isNew = true;
    }
    this.requestUpdate();
    this._updateDirtyState();
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.displayType) return;
    
    // Auto-generate ID if missing
    if (this.isNew && !this.displayType.id) {
       this.displayType.id = this.displayType.name.toLowerCase().replace(/\s+/g, '_');
    }

    this.dispatchEvent(new CustomEvent('save', { detail: { displayType: this.displayType } }));
    this.isNew = false;
    this.requestUpdate();
    this._updateDirtyState();
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
            @input="${(e: any) => { onUpdate(e.target.value); this._updateDirtyState(); }}"
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
      <section-layout>
        <!-- Sidebar: Display Types List -->
        <div slot="left-bar" class="list-sidebar">
          <div class="sidebar-items">
            ${this.displayTypes.map(dt => {
              const dtScale = 60 / Math.max(dt.width_mm, dt.height_mm);
              return html`
                <div 
                  class="sidebar-item ${this.displayType?.id === dt.id && !this.isNew ? 'selected' : ''}" 
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
          </div>
        </div>

        <!-- Toolbar -->
        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${this.isNew ? 'Create New Display Type' : `Editing: ${this.displayType.name}`}
          </div>
          <div class="toolbar-actions">
          </div>
        </div>

        <!-- Main Content -->
        <div slot="right-main" class="editor-layout">
          ${this.viewMode === 'graphical' ? html`
            <form id="display-type-form" @submit="${this._handleSubmit}" @input="${() => { this.requestUpdate(); this._updateDirtyState(); }}">
              <div class="form-group">
                <label>Identifier/Name</label>
                <input 
                  type="text" 
                  required 
                  .value="${live(this.displayType?.name || '')}"
                  @input="${(e: any) => this.displayType!.name = e.target.value}"
                  placeholder="e.g. Living Room Display"
                >
              </div>

              <!-- Device Dimensions Section -->
              <div class="section-header">Device Dimensions</div>
              <div class="row">
                <div class="form-group">
                  <label>Frame Outer Width (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.width_mm || 0)}" @input="${(e: any) => this.displayType!.width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Frame Outer Height (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.height_mm || 0)}" @input="${(e: any) => this.displayType!.height_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Frame Border Width (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.frame?.border_width_mm || 0)}" @input="${(e: any) => this.displayType!.frame.border_width_mm = parseInt(e.target.value)}">
                </div>
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Display Panel Width (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.panel_width_mm || 0)}" @input="${(e: any) => this.displayType!.panel_width_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Display Panel Height (mm)</label>
                  <input type="number" required .value="${live(this.displayType?.panel_height_mm || 0)}" @input="${(e: any) => this.displayType!.panel_height_mm = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Colour Type</label>
                  <select .value="${live(this.displayType?.colour_type || 'MONO')}" @change="${(e: any) => { this.displayType!.colour_type = e.target.value; this.requestUpdate(); this._updateDirtyState(); }}">
                    <option value="MONO">MONO (B/W)</option>
                    <option value="BWR">BWR (Red)</option>
                    <option value="BWY">BWY (Yellow)</option>
                    <option value="BWRY">BWRY (Red/Yellow)</option>
                    <option value="BWGBRY">BWGBRY (Spectra 6)</option>
                    <option value="GRAYSCALE_4">Greyscale (4-bit)</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Resolution Width (px)</label>
                  <input type="number" required .value="${live(this.displayType?.width_px || 0)}" @input="${(e: any) => this.displayType!.width_px = parseInt(e.target.value)}">
                </div>
                <div class="form-group">
                  <label>Resolution Height (px)</label>
                  <input type="number" required .value="${live(this.displayType?.height_px || 0)}" @input="${(e: any) => this.displayType!.height_px = parseInt(e.target.value)}">
                </div>
                <div class="form-group"></div> <!-- Placeholder for 3rd column alignment -->
              </div>

              <div class="section-header">Aesthetics</div>
              <div class="row">
                ${this._renderColourPicker('Frame Colour', this.displayType.frame.colour, (c) => { this.displayType!.frame.colour = c; this.requestUpdate(); })}
                ${this._renderColourPicker('Mat Colour', this.displayType.mat.colour, (c) => { this.displayType!.mat.colour = c; this.requestUpdate(); })}
              </div>

              <div style="display: none;">
                <button id="real-submit" type="submit"></button>
              </div>
            </form>
          ` : html`
            <yaml-editor
              .data="${this.displayType}"
              .schemaName="DisplayType"
              @data-update="${(e: CustomEvent) => {
                this.displayType = e.detail;
                this.requestUpdate();
                this._updateDirtyState();
              }}"
            ></yaml-editor>
          `}

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

            <div class="summary-panel">
              <div class="summary-content">
                <div class="preview-label" style="margin-bottom: 12px;">Dimension Summary</div>
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
      </section-layout>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'display-types-view': DisplayTypesView;
  }
}
