import { LitElement, html, css } from 'lit';
import { commonStyles } from '../styles/common-styles.js';

export class SideBar extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        width: 320px;
        flex-shrink: 0;
        background-color: white;
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      .sidebar-section {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        flex: 1;
        overflow-y: auto;
      }
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      h3 { margin: 0; font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
      
      .list-item {
        padding: 0.75rem;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }
      .list-item:hover { border-color: var(--primary-color); background: #f0faff; }
      .list-item.selected { 
        border-color: var(--primary-color); 
        background: #e1f5fe; 
        box-shadow: 0 2px 8px rgba(3,169,244,0.1); 
      }
      
      .item-details { display: flex; justify-content: space-between; align-items: center; }
      .item-info { flex: 1; }
      .item-name { font-weight: 600; display: block; }
      .item-meta { font-size: 11px; color: #888; }
      .item-actions { display: flex; gap: 4px; }
      
      .sidebar button.secondary,
      .sidebar button.danger {
        padding: 4px;
        border-radius: 4px;
        min-width: 24px;
        height: 24px;
      }
    `
  ];

  static properties = {
    displayTypes: { type: Array },
    activeLayout: { type: Object },
    selectedItemId: { type: String },
  };

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="sidebar-section">
        <div class="sidebar-header">
          <h3>Display Types</h3>
          <button class="secondary" @click="${() => this._dispatch('add-display-type')}" title="Add New Display Type">
            <span class="material-icons" style="font-size: 18px;">add</span>
          </button>
        </div>
        ${this.displayTypes.map(dt => html`
          <div class="list-item" @dblclick="${() => this._dispatch('edit-display-type', dt)}">
            <div class="item-details">
              <div class="item-info">
                <span class="item-name">${dt.name}</span>
                <span class="item-meta">${dt.width_mm}x${dt.height_mm}mm</span>
              </div>
              <div class="item-actions">
                <button class="secondary" title="Add to Layout" @click="${(e) => { e.stopPropagation(); this._dispatch('add-item-to-layout', dt); }}">
                  <span class="material-icons" style="font-size: 16px;">add_box</span>
                </button>
                <button class="secondary" title="Edit Properties" @click="${(e) => { e.stopPropagation(); this._dispatch('edit-display-type', dt); }}">
                  <span class="material-icons" style="font-size: 16px;">edit</span>
                </button>
                <button class="danger" title="Delete" @click="${(e) => { e.stopPropagation(); this._dispatch('delete-display-type', dt); }}">
                  <span class="material-icons" style="font-size: 16px;">delete_outline</span>
                </button>
              </div>
            </div>
          </div>
        `)}
      </div>

      <div class="sidebar-section" style="flex: 2;">
        <h3>Layout Items</h3>
        ${this.activeLayout?.items.map(item => {
          const dt = this.displayTypes.find(t => t.id === item.display_type_id);
          return html`
            <div 
              class="list-item ${this.selectedItemId === item.id ? 'selected' : ''}" 
              @click="${() => this._dispatch('select-item', { id: item.id })}"
              @dblclick="${() => this._dispatch('edit-item', { id: item.id })}"
            >
              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">${dt?.name || 'Unknown'}</span>
                  <span class="item-meta">Pos: ${item.x_mm}, ${item.y_mm} | Rot: ${item.orientation}°</span>
                </div>
                <div class="item-actions">
                  <button class="secondary" title="Rotate" @click="${(e) => { e.stopPropagation(); this._dispatch('rotate-item', { id: item.id }); }}">
                    <span class="material-icons" style="font-size: 16px;">rotate_right</span>
                  </button>
                  <button class="secondary" title="Settings" @click="${(e) => { e.stopPropagation(); this._dispatch('edit-item', { id: item.id }); }}">
                    <span class="material-icons" style="font-size: 16px;">settings</span>
                  </button>
                  <button class="secondary" title="Delete" style="color: var(--danger-color);" @click="${(e) => { e.stopPropagation(); this._dispatch('delete-item', { id: item.id }); }}">
                    <span class="material-icons" style="font-size: 16px;">delete_outline</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('side-bar', SideBar);
