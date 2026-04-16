import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { DisplayType, Layout } from '../../services/HaApiClient';

@customElement('side-bar')
export class SideBar extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        width: 320px;
        flex-shrink: 0;
        background-color: white;
        border-right: 1px solid var(--border-colour);
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
      .list-item:hover { border-color: var(--primary-colour); background: #f0faff; }
      .list-item.selected { 
        border-color: var(--primary-colour); 
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

  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: String }) selectedItemId: string | null = null;
  @property({ type: Boolean }) disabled = false;

  private _dispatch(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="sidebar-section" style="flex: 2; ${this.disabled ? 'opacity: 0.5; pointer-events: none;' : ''}">
        <h3>Layout Items</h3>
        ${(this.activeLayout?.items || []).map((item, index) => {
          const dt = this.displayTypes.find(t => t.id === item.display_type_id);
          return html`
            <div 
              class="list-item ${this.selectedItemId === item.id ? 'selected' : ''}" 
              @click="${() => !this.disabled && this._dispatch('select-item', { id: item.id })}"
              @dblclick="${() => !this.disabled && this._dispatch('edit-item', { id: item.id })}"
            >
              <div class="item-details">
                <div class="item-info">
                  <span class="item-name">#${index + 1}: ${dt?.name || 'Unknown'}</span>
                  <span class="item-meta">Pos: ${item.x_mm}, ${item.y_mm} | Orient: ${item.orientation}</span>
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
