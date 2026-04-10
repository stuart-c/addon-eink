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
      .header-title {
        display: flex;
        align-items: center;
        gap: 1.5rem;
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
        width: 32px;
        height: 32px;
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
      header button:not(.nav-item) {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
    `
  ];

  @property({ type: String }) activeSection = 'layouts';
  @property({ type: Boolean }) connected = false;
  @property({ type: String }) message = '';
  @property({ type: Boolean }) isSaving = false;
  @property({ type: Boolean }) isDirty = false;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  private _dispatchSection(section: string) {
    this.dispatchEvent(new CustomEvent('set-section', {
      detail: section,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <header>
        <div class="header-title">
          <div><strong>eInk Layout Manager</strong></div>
          <div class="nav-group">
            <button class="nav-item ${this.activeSection === 'display-types' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('display-types')}" title="Display Types">
              <span class="material-icons">settings_input_component</span>
            </button>
            <button class="nav-item ${this.activeSection === 'layouts' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('layouts')}" title="Layouts">
              <span class="material-icons">dashboard</span>
            </button>
            <button class="nav-item ${this.activeSection === 'images' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('images')}" title="Images">
              <span class="material-icons">image</span>
            </button>
            <button class="nav-item ${this.activeSection === 'scenes' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('scenes')}" title="Scenes">
              <span class="material-icons">landscape</span>
            </button>
          </div>
        </div>

        <div class="header-actions">
          ${this.message ? html`<span class="message-badge">${this.message}</span>` : ''}
          
          <button class="secondary" @click="${() => this._dispatch('toggle-view-mode')}" title="Switch to ${this.viewMode === 'graphical' ? 'YAML' : 'Graphical'} Mode">
            <span class="material-icons">${this.viewMode === 'graphical' ? 'code' : 'dashboard'}</span>
          </button>

          <button class="secondary" @click="${() => this._dispatch('discard-layout')}" ?disabled="${!this.isDirty || this.isSaving}" title="Discard Changes">
            <span class="material-icons">history</span>
          </button>
          
          <button class="secondary" @click="${() => this._dispatch('save-layout')}" ?disabled="${this.isSaving}" title="${this.isSaving ? 'Saving...' : 'Save Layout'}">
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
