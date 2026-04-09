import { LitElement, html, css } from 'lit';
import './shared/base-dialog.js';
import { commonStyles } from '../styles/common-styles.js';

export class LayoutSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `
  ];

  static properties = {
    settings: { type: Object },
  };

  show(settings) {
    this.settings = JSON.parse(JSON.stringify(settings));
    this.shadowRoot.querySelector('base-dialog').show();
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', { detail: { settings: this.settings } }));
    this.shadowRoot.querySelector('base-dialog').close();
  }

  render() {
    if (!this.settings) return '';

    return html`
      <base-dialog title="Layout Settings">
        <form id="layout-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Layout Name</label>
            <input type="text" required .value="${this.settings.name}" @input="${e => this.settings.name = e.target.value}">
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Canvas Width (mm)</label>
              <input type="number" required .value="${this.settings.canvas_width_mm}" @input="${e => this.settings.canvas_width_mm = parseInt(e.target.value)}">
            </div>
            <div class="form-group">
              <label>Canvas Height (mm)</label>
              <input type="number" required .value="${this.settings.canvas_height_mm}" @input="${e => this.settings.canvas_height_mm = parseInt(e.target.value)}">
            </div>
          </div>

          <div class="form-group">
            <label>Grid Snap (mm)</label>
            <input type="number" required step="1" min="1" max="50" .value="${this.settings.grid_snap_mm}" @input="${e => this.settings.grid_snap_mm = parseInt(e.target.value)}">
          </div>
        </form>

        <div slot="footer">
          <button class="secondary" @click="${() => this.shadowRoot.querySelector('base-dialog').close()}">Cancel</button>
          <button class="primary" @click="${() => this.shadowRoot.getElementById('layout-form').requestSubmit()}">Save Settings</button>
        </div>
      </base-dialog>
    `;
  }
}
customElements.define('layout-settings-dialog', LayoutSettingsDialog);
