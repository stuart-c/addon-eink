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
        padding: 0.5rem 1.5rem;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-small);
        z-index: 100;
        position: relative;
      }
      .nav-group {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: rgba(255,255,255,0.15);
        padding: 4px;
        border-radius: 8px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        background: transparent;
        padding: 0;
      }
      .nav-item:hover {
        background: rgba(255,255,255,0.1);
        color: white;
      }
      .nav-item.active {
        background: white;
        color: var(--primary-colour);
        box-shadow: var(--shadow-small);
      }
      .header-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
      .status-dot {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 0.5rem;
      }
      
      .message-badge {
        font-size: 12px;
        font-weight: 600;
        background: white;
        color: var(--primary-colour);
        padding: 4px 12px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      header button.action-icon {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        color: white;
        box-shadow: none;
        border: 1px solid transparent;
      }
      header button.action-icon:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.3);
      }
      header button.action-icon.primary {
        background: white;
        color: var(--primary-colour);
      }
    `
  ];

  @property({ type: String }) activeSection = 'layouts';
  @property({ type: Boolean }) connected = false;
  @property({ type: String }) message = '';
  @property({ type: Boolean }) isSaving = false;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  private _dispatch(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <header>
        <div class="nav-group">
          <button class="nav-item ${this.activeSection === 'display-types' ? 'active' : ''}" 
            @click="${() => this._dispatch('set-section', 'display-types')}" title="Display Types">
            <span class="material-icons">settings_input_component</span>
          </button>
          <button class="nav-item ${this.activeSection === 'layouts' ? 'active' : ''}" 
            @click="${() => this._dispatch('set-section', 'layouts')}" title="Layouts">
            <span class="material-icons">dashboard</span>
          </button>
          <button class="nav-item ${this.activeSection === 'images' ? 'active' : ''}" 
            @click="${() => this._dispatch('set-section', 'images')}" title="Images">
            <span class="material-icons">image</span>
          </button>
          <button class="nav-item ${this.activeSection === 'scenes' ? 'active' : ''}" 
            @click="${() => this._dispatch('set-section', 'scenes')}" title="Scenes">
            <span class="material-icons">landscape</span>
          </button>
        </div>

        <div class="header-actions">
          ${this.message ? html`<span class="message-badge">${this.message}</span>` : ''}
          
          <button class="action-icon" @click="${() => this._dispatch('edit-layout')}" title="Layout Settings">
            <span class="material-icons">settings</span>
          </button>
          
          <button class="action-icon" @click="${() => this._dispatch('toggle-view-mode')}" title="Switch to ${this.viewMode === 'graphical' ? 'YAML' : 'Graphical'} Mode">
            <span class="material-icons">${this.viewMode === 'graphical' ? 'code' : 'apps'}</span>
          </button>
          
          <button class="action-icon primary" @click="${() => this._dispatch('save-layout')}" ?disabled="${this.isSaving}" title="${this.isSaving ? 'Saving...' : 'Save Layout'}">
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
