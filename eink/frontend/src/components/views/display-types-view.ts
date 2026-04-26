import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import type { DisplayType } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/empty-view';
import '../shared/hardware-preview';
import '../shared/section-layout';
import '../shared/sidebar-list';
import { DisplayTypesViewController } from '../../controllers/DisplayTypesViewController';
import { HaStateController } from '../../controllers/HaStateController';
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

  @property({ type: Object }) state!: HaStateController;
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: String }) selectedId: string | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  public controller = new DisplayTypesViewController(this);

  private _PRESETS = [
    { name: 'White', colour: '#ffffff' },
    { name: 'Black', colour: '#000000' },
    { name: 'Brown', colour: '#5d4037' },
    { name: 'Silver', colour: '#c0c0c0' }
  ];

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('state') || changedProperties.has('displayTypes')) {
      this.controller.resetBaseline();
    }
  }

  get isDirty() {
    return this.controller.isDirty;
  }

  get canDelete() {
    return this.controller.canDelete;
  }

  public save() {
    this.controller.save();
  }

  public discard() {
    this.controller.discard();
  }

  public addNew() {
    this.controller.addNew();
  }

  public requestDelete() {
    this.controller.requestDelete();
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
              @click="${() => { onUpdate(p.colour); this.requestUpdate(); }}"
            ></div>
          `)}
        </div>
        <div class="colour-input-container">
          <input 
            type="color" 
            .value="${live(value)}" 
            @input="${(e: any) => { onUpdate(e.target.value); this.requestUpdate(); }}"
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
    if (!this.controller.activeType) return html`<empty-view title="Display Types" icon="settings_input_component" message="Manage your hardware display types here."></empty-view>`;

    const frameW = this.controller.activeType.width_mm || 0;
    const frameH = this.controller.activeType.height_mm || 0;
    const border = this.controller.activeType.frame?.border_width_mm || 0;
    const panelW = this.controller.activeType.panel_width_mm || 0;
    const panelH = this.controller.activeType.panel_height_mm || 0;

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    const cutoutX = (matW - panelW) / 2;
    const cutoutY = (matH - panelH) / 2;

    const maxPreviewDim = 240; 
    const scale = frameW > 0 && frameH > 0 
      ? maxPreviewDim / Math.max(frameW, frameH) 
      : 1;

    const listItems = this.controller.displayTypes.map(dt => ({
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
            .selectedId="${this.selectedId}"
            @select="${(e: CustomEvent) => this.controller.selectType(e.detail.item.id)}"
          ></sidebar-list>
        </div>

        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">
            ${this.controller.isAdding ? 'Create New Display Type' : (this.controller.activeType ? this.controller.activeType.name : 'Display Types')}
          </div>
        </div>

        <div slot="right-main" class="${!this.controller.activeType ? '' : 'editor-layout'}">
          ${!this.controller.activeType ? html`
            <empty-view
              title="Display Types"
              icon="settings_input_component"
              message="Manage your hardware display types here. Add your first display type to get started."
            ></empty-view>
          ` : html`
            ${this.viewMode === 'graphical' ? html`
              <form id="display-type-form" @submit="${(e: any) => { e.preventDefault(); this.controller.save(); }}">
                <div class="form-group">
                  <label>Identifier/Name</label>
                  <input 
                    type="text" 
                    required 
                    .value="${live(this.controller.activeType.name)}"
                    @input="${(e: any) => this.controller.updateActiveType({ name: e.target.value })}"
                    placeholder="e.g. Living Room Display"
                  >
                </div>

                <div class="section-header">Device Dimensions</div>
                <div class="row">
                  <div class="form-group">
                    <label>Frame Outer Width (mm)</label>
                    <input type="number" required .value="${live(this.controller.activeType.width_mm)}" @input="${(e: any) => this.controller.updateActiveType({ width_mm: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group">
                    <label>Frame Outer Height (mm)</label>
                    <input type="number" required .value="${live(this.controller.activeType.height_mm)}" @input="${(e: any) => this.controller.updateActiveType({ height_mm: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group">
                    <label>Frame Border Width (mm)</label>
                    <input type="number" required .value="${live(this.controller.activeType.frame.border_width_mm)}" @input="${(e: any) => this.controller.updateActiveType({ frame: { ...this.controller.activeType!.frame, border_width_mm: parseInt(e.target.value) } })}">
                  </div>
                </div>

                <div class="row">
                  <div class="form-group">
                    <label>Display Panel Width (mm)</label>
                    <input type="number" required .value="${live(this.controller.activeType.panel_width_mm)}" @input="${(e: any) => this.controller.updateActiveType({ panel_width_mm: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group">
                    <label>Display Panel Height (mm)</label>
                    <input type="number" required .value="${live(this.controller.activeType.panel_height_mm)}" @input="${(e: any) => this.controller.updateActiveType({ panel_height_mm: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group">
                    <label>Colour Type</label>
                    <select .value="${live(this.controller.activeType.colour_type)}" @change="${(e: any) => this.controller.updateActiveType({ colour_type: e.target.value })}">
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
                    <input type="number" required .value="${live(this.controller.activeType.width_px)}" @input="${(e: any) => this.controller.updateActiveType({ width_px: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group">
                    <label>Resolution Height (px)</label>
                    <input type="number" required .value="${live(this.controller.activeType.height_px)}" @input="${(e: any) => this.controller.updateActiveType({ height_px: parseInt(e.target.value) })}">
                  </div>
                  <div class="form-group"></div>
                </div>

                <div class="section-header">Aesthetics</div>
                <div class="row">
                  ${this._renderColourPicker('Frame Colour', this.controller.activeType.frame.colour, (c) => this.controller.updateActiveType({ frame: { ...this.controller.activeType!.frame, colour: c } }))}
                  ${this._renderColourPicker('Mat Colour', this.controller.activeType.mat.colour, (c) => this.controller.updateActiveType({ mat: { ...this.controller.activeType!.mat, colour: c } }))}
                </div>

                <div style="display: none;">
                  <button id="real-submit" type="submit"></button>
                </div>
              </form>
            ` : html`
              <yaml-editor
                .data="${this.controller.activeType}"
                .schemaName="DisplayType"
                @data-update="${(e: CustomEvent) => this.controller.updateActiveType(e.detail)}"
              ></yaml-editor>
            `}

            <div class="preview-column">
              <div class="preview-header">
                <div class="preview-label">Visual Layout</div>
              </div>
              
              <div class="preview-body">
                <div class="preview-canvas">
                  <hardware-preview
                    .width_mm="${this.controller.activeType.width_mm}"
                    .height_mm="${this.controller.activeType.height_mm}"
                    .border_width_mm="${this.controller.activeType.frame.border_width_mm}"
                    .panel_width_mm="${this.controller.activeType.panel_width_mm}"
                    .panel_height_mm="${this.controller.activeType.panel_height_mm}"
                    .frame_colour="${this.controller.activeType.frame.colour}"
                    .mat_colour="${this.controller.activeType.mat.colour}"
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
