import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../styles/common-styles';
import { DisplayType, Layout } from '../services/HaApiClient';

@customElement('side-bar')
export class SideBar extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        background: var(--bg-white);
        border-right: 1px solid var(--border-colour);
      }
      .sidebar-section {
        padding: 1rem;
        border-bottom: 1px solid var(--border-colour);
        overflow-y: auto;
      }
      .sidebar-section.scrollable {
        flex: 1;
      }
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      h3 { 
        margin: 0; 
        font-size: 11px; 
        font-weight: 700; 
        color: var(--text-muted); 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
      }
      
      .list-item {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        cursor: pointer;
        transition: background-color 0.2s;
        background: var(--bg-white);
        user-select: none;
      }
      .list-item:hover { 
        background-color: #f9f9f9;
      }
      .list-item.selected { 
        background-color: #e3f2fd; 
        border-left: 4px solid var(--primary-colour);
      }
      
      .item-details { display: flex; justify-content: space-between; align-items: center; }
      .item-info { flex: 1; }
      .item-name { font-weight: 700; display: block; color: var(--text-colour); font-size: 14px; margin-bottom: 2px; }
      .item-meta { font-size: 12px; color: var(--text-muted); }
      .item-actions { display: flex; gap: 6px; }
      
      .sidebar button.secondary {
        padding: 4px;
        border-radius: 4px;
        min-width: 28px;
        height: 28px;
        background: white;
        border: 1px solid var(--border-colour);
        color: var(--text-muted);
      }
      .sidebar button.secondary:hover {
        border-color: var(--primary-colour);
        color: var(--primary-colour);
      }
    `
  ];

  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: String }) selectedItemId: string | null = null;

  private _dispatch(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="sidebar-section">
        <div class="sidebar-header">
          <h3>Display Types</h3>
          <button class="secondary" @click="${() => this._dispatch('add-display-type')}" title="Manage Display Types">
            <span class="material-icons" style="font-size: 18px;">settings</span>
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
                <button class="secondary" title="Add to Layout" @click="${(e: Event) => { e.stopPropagation(); this._dispatch('add-item-to-layout', dt); }}">
                  <span class="material-icons" style="font-size: 16px;">add_box</span>
                </button>
              </div>
            </div>
          </div>
        `)}
      </div>

      <div class="sidebar-section scrollable">
        <h3>Layout Items</h3>
        ${this.activeLayout?.items.map((item, index) => {
          const dt = this.displayTypes.find(t => t.id === item.display_type_id);
          return html`
            <div 
              class="list-item ${this.selectedItemId === item.id ? 'selected' : ''}" 
              @click="${() => this._dispatch('select-item', { id: item.id })}"
              @dblclick="${() => this._dispatch('edit-item', { id: item.id })}"
            >
              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">#${index + 1}: ${dt?.name || 'Unknown'}</span>
                  <span class="item-meta">Pos: ${item.x_mm}, ${item.y_mm} | Rot: ${item.orientation}°</span>
                </div>
                <div class="item-actions">
                  <button class="secondary" title="Settings" @click="${(e: Event) => { e.stopPropagation(); this._dispatch('edit-item', { id: item.id }); }}">
                    <span class="material-icons" style="font-size: 16px;">settings</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }) || ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'side-bar': SideBar;
  }
}
