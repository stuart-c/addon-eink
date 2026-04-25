import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import '../shared/base-dialog';
import '../shared/grid-snap-slider';
import { commonStyles } from '../../styles/common-styles';
import { BaseDialog } from '../shared/base-dialog';
import { LayoutSettingsController } from '../../controllers/LayoutSettingsController';

/**
 * A dialog component for configuring layout settings like canvas size and grid snapping.
 */
@customElement('layout-settings-dialog')
export class LayoutSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `
  ];

  private controller = new LayoutSettingsController(this);

  async show(settings: any) {
    this.controller.initialise(settings);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    this.controller.save();
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog title="Layout Settings">
        <form id="layout-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Layout Name</label>
            <input 
              type="text" 
              required 
              .value="${live(this.controller.settings?.name || '')}" 
              @input="${(e: any) => this.controller.updateSettings({ name: e.target.value })}"
            >
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Canvas Width (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.controller.settings?.canvas_width_mm?.toString() || '')}" 
                @input="${(e: any) => this.controller.updateSettings({ canvas_width_mm: parseInt(e.target.value) })}"
              >
            </div>
            <div class="form-group">
              <label>Canvas Height (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.controller.settings?.canvas_height_mm?.toString() || '')}" 
                @input="${(e: any) => this.controller.updateSettings({ canvas_height_mm: parseInt(e.target.value) })}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Snap to Grid</label>
            <grid-snap-slider 
              .value="${this.controller.settings?.grid_snap_mm || 5}"
              @change="${(e: any) => this.controller.updateSettings({ grid_snap_mm: e.detail.value })}"
            ></grid-snap-slider>
          </div>

        </form>

        <div slot="footer">
          <button class="secondary" @click="${() => (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close()}">Cancel</button>
          <button class="primary" @click="${() => (this.shadowRoot?.getElementById('layout-form') as HTMLFormElement).requestSubmit()}">Save Settings</button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'layout-settings-dialog': LayoutSettingsDialog;
  }
}
