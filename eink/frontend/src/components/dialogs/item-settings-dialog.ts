import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { BaseDialog } from '../shared/base-dialog';
import { ItemSettingsController } from '../../controllers/ItemSettingsController';

/**
 * A dialog component for editing the settings of a display item in the layout.
 */
@customElement('item-settings-dialog')
export class ItemSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `
  ];

  private controller = new ItemSettingsController(this);

  async show(item: any, displayTypes: any[], haDevices: any[]) {
    this.controller.initialise(item, displayTypes, haDevices);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    this.controller.save();
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }
  
  private _handleDelete() {
    this.controller.delete();
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog title="Display Settings">
        <form id="item-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Display Type</label>
            <select .value="${live(this.controller.item?.display_type_id || '')}" @change="${(e: any) => this.controller.updateItem({ display_type_id: e.target.value })}">
              ${this.controller.displayTypes.map(dt => html`
                <option value="${dt.id}">${dt.name} (${dt.width_mm}x${dt.height_mm}mm)</option>
              `)}
            </select>
          </div>

          <div class="grid">
            <div class="form-group">
              <label>X Position (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.controller.item?.x_mm.toString() || '0')}" 
                @input="${(e: any) => this.controller.updateItem({ x_mm: parseInt(e.target.value) })}"
              >
            </div>
            <div class="form-group">
              <label>Y Position (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.controller.item?.y_mm.toString() || '0')}" 
                @input="${(e: any) => this.controller.updateItem({ y_mm: parseInt(e.target.value) })}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Orientation</label>
            <select 
              .value="${live(this.controller.item?.orientation || 'landscape')}" 
              @change="${(e: any) => this.controller.updateItem({ orientation: e.target.value })}"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>

          <div class="form-group">
            <label>Device ID (Optional)</label>
            <select 
              .value="${live(this.controller.item?.device_id || '')}" 
              @change="${(e: any) => this.controller.updateItem({ device_id: e.target.value })}"
            >
              <option value="">(None)</option>
              ${this.controller.haDevices.map(device => html`
                <option value="${device.id}">${device.name} (${device.id})</option>
              `)}
            </select>
          </div>
        </form>

        <div slot="footer" style="display: flex; width: 100%; gap: 1rem;">
          <button class="danger" style="margin-right: auto;" @click="${this._handleDelete}">Delete</button>
          <button class="secondary" @click="${() => (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close()}">Cancel</button>
          <button class="primary" @click="${() => (this.shadowRoot?.getElementById('item-form') as HTMLFormElement).requestSubmit()}">Apply</button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-settings-dialog': ItemSettingsDialog;
  }
}
