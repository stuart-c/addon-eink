import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { LayoutItem, DisplayType } from '../services/HaApiClient';
import './shared/base-dialog';
import { commonStyles } from '../styles/common-styles';
import { BaseDialog } from './shared/base-dialog';

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

  @property({ type: Object }) item: LayoutItem | null = null;
  @property({ type: Array }) displayTypes: DisplayType[] = [];

  async show(item: LayoutItem, displayTypes: DisplayType[]) {
    this.item = JSON.parse(JSON.stringify(item));
    this.displayTypes = displayTypes;
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.item) return;

    this.dispatchEvent(new CustomEvent('save', { 
        detail: { 
            id: this.item.id,
            updates: {
                x_mm: parseInt(this.item.x_mm as any),
                y_mm: parseInt(this.item.y_mm as any),
                display_type_id: this.item.display_type_id,
                orientation: parseInt(this.item.orientation as any)
            }
        } 
    }));
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }
  
  private _handleDelete() {
    if (!this.item) return;
    this.dispatchEvent(new CustomEvent('delete', { detail: { id: this.item.id } }));
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog title="Display Settings">
        <form id="item-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Display Type</label>
            <select .value="${live(this.item?.display_type_id || '')}" @change="${(e: any) => this.item ? this.item.display_type_id = e.target.value : null}">
              ${this.displayTypes.map(dt => html`
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
                .value="${live(this.item?.x_mm.toString() || '0')}" 
                @input="${(e: any) => this.item ? this.item.x_mm = e.target.value : null}"
              >
            </div>
            <div class="form-group">
              <label>Y Position (mm)</label>
              <input 
                type="number" 
                required 
                .value="${live(this.item?.y_mm.toString() || '0')}" 
                @input="${(e: any) => this.item ? this.item.y_mm = e.target.value : null}"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Orientation</label>
            <select 
              .value="${live(this.item?.orientation.toString() || '0')}" 
              @change="${(e: any) => this.item ? this.item.orientation = e.target.value : null}"
            >
              <option value="0">Horizontal (0°)</option>
              <option value="90">Vertical (90°)</option>
            </select>
          </div>
        </form>

        <div slot="footer">
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
