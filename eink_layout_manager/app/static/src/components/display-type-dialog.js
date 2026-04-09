import { LitElement, html, css } from 'lit';
import './shared/base-dialog.js';
import './shared/hardware-preview.js';
import { commonStyles } from '../styles/common-styles.js';

export class DisplayTypeDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .main-layout {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 1.5rem;
      }
      .form-scroll {
        max-height: 60vh;
        overflow-y: auto;
        padding-right: 1rem;
      }
      .preview-column {
        background: var(--bg-light);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        gap: 1rem;
        border-radius: 8px;
      }
      .preview-label {
        font-size: 11px;
        font-weight: bold;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .row { display: flex; gap: 1rem; }
      .row > * { flex: 1; }
      
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
      .swatch-group { display: flex; gap: 8px; margin: 4px 0 8px 0; }
      .swatch {
        width: 28px; height: 28px; border-radius: 6px; cursor: pointer;
        border: 1px solid #ddd; transition: all 0.2s;
      }
      .swatch.selected { border: 2px solid var(--primary-colour); box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2); }
      
      .summary-table {
        width: 100%; border-collapse: collapse; font-size: 12px;
        background: white; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-small);
      }
      .summary-table th, .summary-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; }
      .summary-table th { background: #f8f9fa; color: #666; font-weight: 700; width: 45%; }
      .summary-table .val { font-weight: 600; color: #333; }
    `
  ];

  static properties = {
    displayType: { type: Object },
    isNew: { type: Boolean },
  };

  _PRESETS = [
    { name: 'White', colour: '#ffffff' },
    { name: 'Black', colour: '#000000' },
    { name: 'Brown', colour: '#5d4037' },
    { name: 'Silver', colour: '#c0c0c0' }
  ];

  show(displayType = null) {
    if (displayType) {
      this.displayType = JSON.parse(JSON.stringify(displayType));
      this.isNew = false;
    } else {
      this.displayType = {
        id: '', name: 'New Display', width_mm: 300, height_mm: 200,
        panel_width_mm: 158, panel_height_mm: 98, width_px: 800, height_px: 480,
        colour_type: 'MONO', frame: { border_width_mm: 15, colour: '#000000' },
        mat: { colour: '#ffffff' }
      };
      this.isNew = true;
    }
    this.shadowRoot.querySelector('base-dialog').show();
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this.isNew && !this.displayType.id) {
       this.displayType.id = this.displayType.name.toLowerCase().replace(/\s+/g, '_');
    }
    this.dispatchEvent(new CustomEvent('save', { detail: { displayType: this.displayType } }));
    this.shadowRoot.querySelector('base-dialog').close();
  }

  render() {
    if (!this.displayType) return '';

    const frameW = this.displayType.width_mm || 0;
    const frameH = this.displayType.height_mm || 0;
    const border = this.displayType.frame?.border_width_mm || 0;
    const panelW = this.displayType.panel_width_mm || 0;
    const panelH = this.displayType.panel_height_mm || 0;

    const scale = frameW > 0 && frameH > 0 ? 240 / Math.max(frameW, frameH) : 1;

    return html`
      <base-dialog .title="${this.isNew ? 'Add Display Type' : 'Edit Display Type'}" style="--base-dialog-width: 850px;">
        <div class="main-layout">
          <form id="dt-form" class="form-scroll" @submit="${this._handleSubmit}" @input="${() => this.requestUpdate()}">
            <div class="form-group">
              <label>Identifier/Name</label>
              <input type="text" required .value="${this.displayType.name}" @input="${e => this.displayType.name = e.target.value}">
            </div>

            <div class="section-header">Physical Dimensions</div>
            <div class="row">
              <div class="form-group"><label>Frame Width (mm)</label><input type="number" required .value="${this.displayType.width_mm}" @input="${e => this.displayType.width_mm = parseInt(e.target.value)}"></div>
              <div class="form-group"><label>Frame Height (mm)</label><input type="number" required .value="${this.displayType.height_mm}" @input="${e => this.displayType.height_mm = parseInt(e.target.value)}"></div>
            </div>
            <div class="row">
              <div class="form-group"><label>Panel Width (mm)</label><input type="number" required .value="${this.displayType.panel_width_mm}" @input="${e => this.displayType.panel_width_mm = parseInt(e.target.value)}"></div>
              <div class="form-group"><label>Panel Height (mm)</label><input type="number" required .value="${this.displayType.panel_height_mm}" @input="${e => this.displayType.panel_height_mm = parseInt(e.target.value)}"></div>
            </div>
            <div class="form-group"><label>Border Width (mm)</label><input type="number" required .value="${this.displayType.frame.border_width_mm}" @input="${e => this.displayType.frame.border_width_mm = parseInt(e.target.value)}"></div>

            <div class="section-header">Display Spec</div>
            <div class="row">
              <div class="form-group"><label>Resolution X (px)</label><input type="number" required .value="${this.displayType.width_px}" @input="${e => this.displayType.width_px = parseInt(e.target.value)}"></div>
              <div class="form-group"><label>Resolution Y (px)</label><input type="number" required .value="${this.displayType.height_px}" @input="${e => this.displayType.height_px = parseInt(e.target.value)}"></div>
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
              <div class="form-group">
                <label>Frame Colour</label>
                <div class="swatch-group">
                  ${this._PRESETS.map(p => html`<div class="swatch ${this.displayType.frame.colour === p.colour ? 'selected' : ''}" style="background: ${p.colour}" @click="${() => { this.displayType.frame.colour = p.colour; this.requestUpdate(); }}"></div>`)}
                  <input type="color" .value="${this.displayType.frame.colour}" @input="${e => { this.displayType.frame.colour = e.target.value; this.requestUpdate(); }}">
                </div>
              </div>
              <div class="form-group">
                <label>Mat Colour</label>
                <div class="swatch-group">
                  ${this._PRESETS.map(p => html`<div class="swatch ${this.displayType.mat.colour === p.colour ? 'selected' : ''}" style="background: ${p.colour}" @click="${() => { this.displayType.mat.colour = p.colour; this.requestUpdate(); }}"></div>`)}
                  <input type="color" .value="${this.displayType.mat.colour}" @input="${e => { this.displayType.mat.colour = e.target.value; this.requestUpdate(); }}">
                </div>
              </div>
            </div>
          </form>

          <div class="preview-column">
            <span class="preview-label">Visual Preview</span>
            <hardware-preview
              .width_mm="${frameW}"
              .height_mm="${frameH}"
              .border_width_mm="${border}"
              .panel_width_mm="${panelW}"
              .panel_height_mm="${panelH}"
              .frame_colour="${this.displayType.frame.colour}"
              .mat_colour="${this.displayType.mat.colour}"
              .scale="${scale}"
            ></hardware-preview>
            
            <table class="summary-table">
              <tr><th>Overall Size</th><td><span class="val">${frameW}x${frameH}</span> mm</td></tr>
              <tr><th>Aperture</th><td><span class="val">${(frameW - 2*border).toFixed(1)}x${(frameH - 2*border).toFixed(1)}</span> mm</td></tr>
              <tr><th>Panel</th><td><span class="val">${panelW}x${panelH}</span> mm</td></tr>
            </table>
          </div>
        </div>

        <div slot="footer">
          <button class="secondary" @click="${() => this.shadowRoot.querySelector('base-dialog').close()}">Cancel</button>
          <button class="primary" @click="${() => this.shadowRoot.getElementById('dt-form').requestSubmit()}">Save Type</button>
        </div>
      </base-dialog>
    `;
  }
}
customElements.define('display-type-dialog', DisplayTypeDialog);
