import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import type { DisplayType } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/empty-view';
import '../shared/hardware-preview';
import '../shared/section-layout';
import '../shared/sidebar-list';
import '../layout/yaml-editor';

/**
 * A view component for managing eInk Display Types.
 */
@customElement('display-types-view')
export class DisplayTypesView extends BaseResourceView {
  static styles = [
    commonStyles,
    css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    
    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      height: 100%;
      overflow: hidden;
    }

    form {
      padding: 1.5rem 2rem;
      overflow-y: auto;
      border-right: 1px solid var(--border-colour);
      background: white;
    }

    .preview-column {
      background: var(--bg-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      overflow-y: auto;
      position: relative;
    }

    .preview-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-colour);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
    }

    .preview-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      width: 100%;
      box-sizing: border-box;
    }

    .preview-canvas {
      width: 280px;
      height: 280px;
      background: #fff;
      border: 1px solid var(--border-colour);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-small);
      position: relative;
      overflow: hidden;
    }

    .preview-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 100%;
    }

    .section-header {
      margin-top: 1.75rem;
      margin-bottom: 1rem;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-colour-light);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid var(--border-colour);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .swatch:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-small);
      border-color: var(--primary-colour);
    }
    .swatch.selected {
      border: 2px solid var(--primary-colour);
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.15);
    }
    .colour-input-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-light);
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-colour);
    }
    input[type="color"] {
      width: 40px;
      height: 36px;
      border: 1px solid var(--border-colour);
      border-radius: 4px;
      cursor: pointer;
      padding: 2px;
      background: #fff;
    }
    .hex-value {
      font-family: var(--font-family-mono);
      font-size: 12px;
      color: var(--text-colour);
      text-transform: uppercase;
      font-weight: 600;
      flex: 1;
      letter-spacing: 0.5px;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      font-size: 12px;
      border: 1px solid var(--border-colour);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .summary-table th, .summary-table td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border-colour-light);
    }
    .summary-table th {
      background: var(--bg-light);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      width: 45%;
    }
    .summary-table tr:last-child td, .summary-table tr:last-child th {
      border-bottom: none;
    }
    .summary-table .val {
      font-weight: 600;
      color: var(--text-colour);
    }
    .summary-table .unit {
      color: var(--text-muted);
      margin-left: 2px;
      font-size: 11px;
    }
    `
  ];

  @property({ type: Object }) displayType?: DisplayType;
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: String }) selectedId: string | null = null;
  @property({ type: Boolean }) isNew = true;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @property({ type: Boolean }) isAdding = false;

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
      panel_orientation: 'landscape',
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

  protected willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedId') || changedProperties.has('displayTypes') || changedProperties.has('isAdding')) {
      this._syncSelection();
    }
    if (changedProperties.has('displayType') || changedProperties.has('displayTypes') || changedProperties.has('isNew')) {
      this._updateDirtyState();
      this.notifyCanDelete(!this.isNew && !!this.displayType);
    }
  }

  private _syncSelection() {
    const found = this.selectedId ? this.displayTypes.find(dt => dt.id === this.selectedId) : null;
    
    if (found) {
      if (this.displayType?.id !== found.id || this.isNew) {
        this.displayType = JSON.parse(JSON.stringify(found));
        this.isNew = false;
      }
    } else {
      if (this.isAdding) {
        if (!this.isNew || !this.displayType || this.displayType.id !== '') {
          this.displayType = this._getDefaultDisplayType();
          this.isNew = true;
        }
      } else {
        this.displayType = undefined;
        this.isNew = true;
      }
    }
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
      this.notifyDirty(dirty);
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
    this.displayType = undefined;
    this._syncSelection();
    this._updateDirtyState();
    this.requestUpdate();
  }

  public addNew() {
    this.dispatchEvent(new CustomEvent('prepare-new-display-type', { bubbles: true, composed: true }));
  }

  private async _handleSelect(id: string | null) {
    if (id === null && this.isAdding) return;
    if (id !== null && id === this.selectedId && !this.isAdding) return;

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
    if (!this.displayType || this.isNew) return;
    this.dispatchEvent(new CustomEvent('delete-display-type', { detail: this.displayType }));
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.displayType) return;
    
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
    const frameW = this.displayType?.width_mm || 0;
    const frameH = this.displayType?.height_mm || 0;
    const border = this.displayType?.frame?.border_width_mm || 0;
    const panelW = this.displayType?.panel_width_mm || 0;
    const panelH = this.displayType?.panel_height_mm || 0;

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    const cutoutX = (matW - panelW) / 2;
    const cutoutY = (matH - panelH) / 2;

    const maxPreviewDim = 240; 
    const scale = frameW > 0 && frameH > 0 
      ? maxPreviewDim / Math.max(frameW, frameH) 
      : 1;

    const listItems = this.displayTypes.map(dt => ({
      id: dt.id,
      name: dt.name,
      iconHtml: html`
        <div style="transform: scale(0.6)">
            <hardware-preview
                .width_mm="${dt.width_mm}"
                .height_mm="${dt.height_mm}"
                .border_width_mm="${dt.frame.border_width_mm}"
                .panel_width_mm="${dt.panel_width_mm}"
                .panel_height_mm="${dt.panel_height_mm}"
                .frame_colour="${dt.frame.colour}"
                .mat_colour="${dt.mat.colour}"
                .scale="${40 / Math.max(dt.width_mm, dt.height_mm)}"
            ></hardware-preview>
        </div>
      `
    }));

    return html`
      <section-layout>
        <div slot="left-bar">
          <sidebar-list
            .items="${listItems}"
            .selectedId="${this.displayType?.id && !this.isNew ? this.displayType.id : null}"
            @select="${(e: CustomEvent) => this._handleSelect(e.detail.item.id)}"
          ></sidebar-list>
        </div>

        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${this.isAdding ? 'Create New Display Type' : (this.displayType && !this.isNew ? this.displayType.name : 'Display Types')}
          </div>
        </div>

        <div slot="right-main" class="${!this.displayType ? '' : 'editor-layout'}">
          ${!this.displayType ? html`
            <empty-view
              title="Display Types"
              icon="settings_input_component"
              message="Manage your hardware display types here. Add your first display type to get started."
            ></empty-view>
          ` : html`
            ${this.viewMode === 'graphical' ? html`
              <form id="display-type-form" @submit="${this._handleSubmit}" @input="${() => { this.requestUpdate(); this._updateDirtyState(); }}">
                <div class="row">
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
                  <div class="form-group">
                    <label>Panel Orientation</label>
                    <select .value="${live(this.displayType?.panel_orientation || 'landscape')}" @change="${(e: any) => { this.displayType!.panel_orientation = e.target.value; this.requestUpdate(); this._updateDirtyState(); }}">
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                </div>

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
                  <div class="form-group"></div>
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
              <div class="preview-header">
                <div class="preview-label">Visual Layout</div>
              </div>
              
              <div class="preview-body">
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

                </div>

                <div class="preview-header">
                  <div class="preview-label">Dimension Summary</div>
                </div>

                <div class="preview-body">
                  <table class="summary-table">
                    <tr><th>Overall Frame</th><td><span class="val">${this._formatDim(frameW)} x ${this._formatDim(frameH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Mat (Aperture)</th><td><span class="val">${this._formatDim(matW)} x ${this._formatDim(matH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Display Panel</th><td><span class="val">${this._formatDim(panelW)} x ${this._formatDim(panelH)}</span><span class="unit">mm</span></td></tr>
                    <tr><th>Cutout Position</th><td><span class="val">${this._formatDim(cutoutX)} x ${this._formatDim(cutoutY)}</span><span class="unit">mm</span></td></tr>
                  </table>
                </div>
              </div>
            </div>
          `}
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
