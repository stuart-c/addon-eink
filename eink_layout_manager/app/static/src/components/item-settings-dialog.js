import { LitElement, html, css } from 'lit';
import './shared/base-dialog.js';
import { commonStyles } from '../styles/common-styles.js';

export class ItemSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    `
  ];

  static properties = {
    item: { type: Object },
    displayTypes: { type: Array },
  };

  show(item, displayTypes) {
    this.item = JSON.parse(JSON.stringify(item));
    this.displayTypes = displayTypes;
    this.shadowRoot.querySelector('base-dialog').show();
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', { 
        detail: { 
            id: this.item.id,
            updates: {
                x_mm: parseInt(this.item.x_mm),
                y_mm: parseInt(this.item.y_mm),
                display_type_id: this.item.display_type_id,
                orientation: parseInt(this.item.orientation)
            }
        } 
    }));
    this.shadowRoot.querySelector('base-dialog').close();
  }

  render() {
    if (!this.item) return '';

    return html`
      <base-dialog title="Display Settings">
        <form id="item-form" @submit="${this._handleSubmit}">
          <div class="form-group">
            <label>Display Type</label>
            <select .value="${this.item.display_type_id}" @change="${e => this.item.display_type_id = e.target.value}">
              ${this.displayTypes.map(dt => html`
                <option value="${dt.id}">${dt.name} (${dt.width_mm}x${dt.height_mm}mm)</option>
              `)}
            </select>
          </div>

          <div class="grid">
            <div class="form-group">
              <label>X Position (mm)</label>
              <input type="number" required .value="${this.item.x_mm}" @input="${e => this.item.x_mm = e.target.value}">
            </div>
            <div class="form-group">
              <label>Y Position (mm)</label>
              <input type="number" required .value="${this.item.y_mm}" @input="${e => this.item.y_mm = e.target.value}">
            </div>
          </div>

          <div class="form-group">
            <label>Orientation</label>
            <select .value="${this.item.orientation}" @change="${e => this.item.orientation = e.target.value}">
              <option value="0">Horizontal (0°)</option>
              <option value="90">Vertical (90°)</option>
            </select>
          </div>
        </form>

        <div slot="footer">
          <button class="secondary" @click="${() => this.shadowRoot.querySelector('base-dialog').close()}">Cancel</button>
          <button class="primary" @click="${() => this.shadowRoot.getElementById('item-form').requestSubmit()}">Apply</button>
        </div>
      </base-dialog>
    `;
  }
}
customElements.define('item-settings-dialog', ItemSettingsDialog);
