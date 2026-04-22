import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

export interface SidebarListItem {
  id: string;
  name: string;
  icon?: string;
  thumbnail?: string;
  iconHtml?: TemplateResult;
  [key: string]: any;
}

/**
 * A reusable list component for the sidebar navigation.
 */
@customElement('sidebar-list')
export class SidebarList extends LitElement {
  @property({ type: Array }) items: SidebarListItem[] = [];
  @property({ type: String }) selectedId: string | null = null;
  @property({ type: String }) defaultIcon = 'folder';

  static styles = [
    commonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      .sidebar-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
      }
      .sidebar-item {
        padding: 10px 12px;
        min-height: 64px;
        box-sizing: border-box;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        background: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        flex-shrink: 0;
      }
      .sidebar-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
        transform: translateX(2px);
      }
      .sidebar-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3, 169, 244, 0.15);
      }
      .sidebar-item-icon {
        color: #888;
        font-size: 20px;
      }
      .sidebar-item.selected .sidebar-item-icon {
        color: var(--primary-colour);
      }
      .sidebar-item-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-colour);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      .sidebar-thumbnail {
        width: 40px;
        height: 30px;
        border-radius: 4px;
        background: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1px solid #eee;
      }
      .sidebar-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .empty-state {
        padding: 2rem 1rem;
        color: #888;
        font-size: 13px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .empty-state .material-icons {
        font-size: 32px;
        opacity: 0.3;
      }
    `
  ];

  render() {
    return html`
      <div class="sidebar-items">
        ${this.items.map(item => html`
          <div 
            class="sidebar-item ${this.selectedId === item.id ? 'selected' : ''}" 
            @click="${() => this._handleSelect(item)}"
          >
            <div class="sidebar-content-anchor">
              ${item.thumbnail ? html`
                <div class="sidebar-thumbnail">
                  <img src="${item.thumbnail}" alt="${item.name}" loading="lazy">
                </div>
              ` : (item.iconHtml ? item.iconHtml : html`
                <span class="material-icons sidebar-item-icon">${item.icon || this.defaultIcon}</span>
              `)}
            </div>
            <span class="sidebar-item-name" title="${item.name}">${item.name}</span>
            ${item.status ? html`
              <span class="status-badge ${item.status}">${item.status}</span>
            ` : ''}
          </div>
        `)}
        ${this.items.length === 0 ? html`
          <div class="empty-state">
            <span class="material-icons">search_off</span>
            <span>No items found</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  private _handleSelect(item: SidebarListItem) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: { item },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sidebar-list': SidebarList;
  }
}
