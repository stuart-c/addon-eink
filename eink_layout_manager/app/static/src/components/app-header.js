import { LitElement, html, css } from 'lit';
import { commonStyles } from '../styles/common-styles.js';

export class AppHeader extends LitElement {
  static styles = [
    commonStyles,
    css`
      header {
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 10;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .message {
        font-size: 13px;
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
        animation: fadeIn 0.3s;
      }
      .status {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 0.5rem;
      }
      header button {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
      }
      header button:hover {
        background: rgba(255,255,255,0.2);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
  ];

  static properties = {
    message: { type: String },
    connected: { type: Boolean },
    saving: { type: Boolean },
  };

  render() {
    return html`
      <header>
        <div><strong>eInk Layout Manager</strong></div>
        <div class="actions">
          ${this.message ? html`<span class="message">${this.message}</span>` : ''}
          <button class="icon-btn" @click="${() => this.dispatchEvent(new CustomEvent('edit-layout'))}" title="Layout Settings">
            <span class="material-icons">settings</span>
          </button>
          <button class="icon-btn" @click="${() => this.dispatchEvent(new CustomEvent('save-layout'))}" ?disabled="${this.saving}" title="${this.saving ? 'Saving...' : 'Save Layout'}">
            <span class="material-icons">${this.saving ? 'sync' : 'save'}</span>
          </button>
          <span class="status">${this.connected ? 'Online' : 'Offline'}</span>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
