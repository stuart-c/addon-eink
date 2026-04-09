import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../styles/common-styles';

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = [
    commonStyles,
    css`
      header {
        background-color: var(--primary-colour);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-small);
        z-index: 10;
      }
      .header-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .message-badge {
        font-size: 13px;
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
      }
      .status-dot {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 0.5rem;
      }
      header button {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
    `
  ];

  @property({ type: Boolean }) connected = false;
  @property({ type: String }) message = '';
  @property({ type: Boolean }) isSaving = false;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';


  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <header>
        <div><strong>eInk Layout Manager</strong></div>
        <div class="header-actions">
          ${this.message ? html`<span class="message-badge">${this.message}</span>` : ''}
          
          <button class="secondary" @click="${() => this._dispatch('edit-layout')}" title="Layout Settings">
            <span class="material-icons">settings</span>
          </button>
          
          <button class="secondary" @click="${() => this._dispatch('toggle-view-mode')}" title="Switch to ${this.viewMode === 'graphical' ? 'YAML' : 'Graphical'} Mode">
            <span class="material-icons">${this.viewMode === 'graphical' ? 'code' : 'dashboard'}</span>
          </button>
          
          <button @click="${() => this._dispatch('save-layout')}" ?disabled="${this.isSaving}" title="${this.isSaving ? 'Saving...' : 'Save Layout'}">
            <span class="material-icons">${this.isSaving ? 'sync' : 'save'}</span>
          </button>

          
          <span class="status-dot">${this.connected ? 'Online' : 'Offline'}</span>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': AppHeader;
  }
}
