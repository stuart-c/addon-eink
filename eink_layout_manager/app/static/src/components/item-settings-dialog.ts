import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LayoutItem, DisplayType } from '../services/HaApiClient';

/**
 * A dialog component for editing the settings of a display item in the layout.
 */
@customElement('item-settings-dialog')
export class ItemSettingsDialog extends LitElement {
  static styles = css`
    dialog {
      border: none;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      width: 360px;
      max-width: 95vw;
      font-family: inherit;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(2px);
    }
    .container {
      padding: 1.75rem;
    }
    header {
      margin-bottom: 1.25rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.75rem;
    }
    h2 { margin: 0; font-size: 1.15rem; color: #333; }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #777;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #03a9f4;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    footer {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    .primary { 
      background: #03a9f4; 
      color: white; 
    }
    .primary:hover {
      background: #0288d1;
    }
    .secondary { 
      background: #f5f5f5; 
      color: #666;
    }
    .secondary:hover {
      background: #eeeeee;
    }
    .info {
      font-size: 12px;
      color: #888;
      margin-top: -8px;
      margin-bottom: 12px;
    }
  `;

  @property({ type: Object }) item: LayoutItem | null = null;
  @property({ type: Array }) displayTypes: DisplayType[] = [];

  show(item: LayoutItem, displayTypes: DisplayType[]) {
    this.item = JSON.parse(JSON.stringify(item));
    this.displayTypes = displayTypes;
    this.shadowRoot?.querySelector('dialog')?.showModal();
  }

  close() {
    this.shadowRoot?.querySelector('dialog')?.close();
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
    this.close();
  }

  render() {
    if (!this.item) return html`
      <dialog></dialog>
    `;

    return html`
      <dialog>
        <div class="container">
          <header>
            <h2>Display Settings</h2>
          </header>
          <form @submit="${this._handleSubmit}">
            <div class="form-group">
              <label>Display Type</label>
              <select 
                .value="${this.item.display_type_id}" 
                @change="${(e: any) => this.item ? this.item.display_type_id = e.target.value : null}"
              >
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
                  .value="${this.item.x_mm.toString()}" 
                  @input="${(e: any) => this.item ? this.item.x_mm = e.target.value : null}"
                >
              </div>
              <div class="form-group">
                <label>Y Position (mm)</label>
                <input 
                  type="number" 
                  required 
                  .value="${this.item.y_mm.toString()}" 
                  @input="${(e: any) => this.item ? this.item.y_mm = e.target.value : null}"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Orientation</label>
              <select 
                .value="${this.item.orientation.toString()}" 
                @change="${(e: any) => this.item ? this.item.orientation = e.target.value : null}"
              >
                <option value="0">Horizontal (0°)</option>
                <option value="90">Vertical (90°)</option>
              </select>
            </div>

            <footer>
              <button type="button" class="secondary" @click="${this.close}">Cancel</button>
              <button type="submit" class="primary">Apply Changes</button>
            </footer>
          </form>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-settings-dialog': ItemSettingsDialog;
  }
}
