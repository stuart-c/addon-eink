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
        border-bottom: 1px solid var(--border-colour);
        flex: 1;
        overflow-y: auto;
      }
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .list-item {
        padding: 10px 12px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        background: white;
      }
      .list-item:hover { 
        border-color: var(--primary-colour); 
        background: var(--bg-light); 
      }
      .list-item.selected { 
        border-color: var(--primary-colour); 
        background: rgba(3, 169, 244, 0.1); 
        box-shadow: 0 2px 8px rgba(3,169,244,0.1); 
      }
      
      .item-details { display: flex; justify-content: space-between; align-items: center; }
      .item-info { flex: 1; }
      .item-name { font-weight: var(--font-weight-semi-bold); font-size: 14px; display: block; color: var(--text-colour); }
      .item-meta { font-size: 11px; color: var(--text-muted); font-weight: 500; }
      .item-actions { display: flex; gap: 4px; }
      
      .sidebar button.secondary {
        padding: 0;
        width: 32px;
        height: 32px;
        border-radius: 6px;
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
      <div class="sidebar-section" style="flex: 2;">
        <div class="sidebar-section-title">
          <span class="material-icons">layers</span>
          Layout Items
        </div>
        ${(this.activeLayout?.items || []).map((item, index) => {
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
