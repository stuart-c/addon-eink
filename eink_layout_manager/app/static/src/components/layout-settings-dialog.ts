import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { Layout } from '../services/HaApiClient';
import './shared/base-dialog';
import { commonStyles } from '../styles/common-styles';
import { BaseDialog } from './shared/base-dialog';

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

  @property({ type: Object }) settings: Partial<Layout> | null = null;

  async show(settings: Layout) {
    this.settings = JSON.parse(JSON.stringify(settings));
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', { detail: { settings: this.settings } }));
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
              .value="${live(this.settings?.name || '')}" 
              @input="${(e: any) => this.settings ? this.settings.name = e.target.value : null}"
            >
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Canvas Width (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.settings?.canvas_width_mm?.toString() || '')}" 
                @input="${(e: any) => this.settings ? this.settings.canvas_width_mm = parseInt(e.target.value) : null}"
              >
            </div>
            <div class="form-group">
              <label>Canvas Height (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.settings?.canvas_height_mm?.toString() || '')}" 
                @input="${(e: any) => this.settings ? this.settings.canvas_height_mm = parseInt(e.target.value) : null}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Grid Snap (mm)</label>
            <input 
              type="number" 
              required 
              step="1" 
              min="1" 
              max="50" 
              .value="${live(this.settings?.grid_snap_mm?.toString() || '')}" 
              @input="${(e: any) => this.settings ? this.settings.grid_snap_mm = parseInt(e.target.value) : null}"
            >
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
