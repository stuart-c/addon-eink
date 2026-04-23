import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { type AppSection } from '../../controllers/HaStateController';

@customElement('app-header')
export class AppHeader extends LitElement {
  static styles = [
    commonStyles,
    css`
      header {
        background-color: var(--primary-colour);
        color: white;
        padding: 0.5rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-small);
        z-index: 10;
        height: 56px;
        box-sizing: border-box;
      }
      .header-title {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .nav-group {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: rgba(255,255,255,0.1);
        padding: 4px;
        border-radius: 10px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        color: rgba(255,255,255,0.8);
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
        gap: 0.5rem;
        align-items: center;
      }
      .message-badge {
        font-size: 12px;
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 500;
        margin-right: 0.5rem;
      }
      .status-dot {
        font-size: 11px;
        opacity: 0.8;
        margin-left: 0.5rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      header button:not(.nav-item) {
        border-radius: 8px;
      }
      header button.secondary {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        box-shadow: none;
      }
      header button.secondary:hover {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.2);
        color: white;
      }
      header button.secondary:disabled {
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.3);
        border-color: transparent;
      }
    `
  ];

  @property({ type: String }) activeSection: AppSection = 'layouts';
  @property({ type: Boolean }) connected = false;
  @property({ type: String }) message = '';
  @property({ type: Boolean }) isSaving = false;
  @property({ type: Boolean }) isDirty = false;
  @property({ type: Boolean }) canDelete = false;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  private _dispatchSection(section: AppSection) {
    this.dispatchEvent(new CustomEvent('set-section', {
      detail: section,
      bubbles: true,
      composed: true
    }));
  }
  
  get _sectionLabel() {
    const labels: Record<string, string> = {
      'display-types': 'Display Types',
      'layouts': 'Layouts',
      'images': 'Images',
      'scenes': 'Scenes'
    };
    return labels[this.activeSection] || this.activeSection;
  }

  render() {
    return html`
      <header>
        <div class="header-title">
          <div class="nav-group">
            <button id="nav-display-types" class="nav-item ${this.activeSection === 'display-types' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('display-types')}" title="Display Types">
              <span class="material-icons">settings_input_component</span>
            </button>
            <button id="nav-layouts" class="nav-item ${this.activeSection === 'layouts' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('layouts')}" title="Layouts">
              <span class="material-icons">dashboard</span>
            </button>
            <button id="nav-images" class="nav-item ${this.activeSection === 'images' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('images')}" title="Images">
              <span class="material-icons">image</span>
            </button>
            <button id="nav-scenes" class="nav-item ${this.activeSection === 'scenes' ? 'active' : ''}" 
              @click="${() => this._dispatchSection('scenes')}" title="Scenes">
              <span class="material-icons">landscape</span>
            </button>
          </div>
          <div><strong>eInk Layout Manager - ${this._sectionLabel}</strong></div>
        </div>

        <div class="header-actions">
          ${this.message ? html`<span class="message-badge">${this.message}</span>` : ''}
          
          ${this.activeSection !== 'images' ? html`
          <button id="btn-toggle-view" class="secondary icon-button" @click="${() => this._dispatch('toggle-view-mode')}" title="Switch to ${this.viewMode === 'graphical' ? 'YAML' : 'Graphical'} Mode">
            <span class="material-icons">${this.viewMode === 'graphical' ? 'code' : 'dashboard'}</span>
          </button>
          ` : ''}

          <button id="btn-header-add" class="secondary icon-button" @click="${() => this._dispatch('add-item')}" title="Add New Item">
            <span class="material-icons">add</span>
          </button>

          ${this.activeSection !== 'images' ? html`
          <button id="btn-discard" class="secondary icon-button" @click="${() => this._dispatch('discard-changes')}" ?disabled="${!this.isDirty || this.isSaving}" title="Discard Changes">
            <span class="material-icons">history</span>
          </button>
          ` : ''}

          <button id="btn-header-delete" class="secondary icon-button" @click="${() => this._dispatch('delete-item')}" ?disabled="${!this.canDelete || this.isSaving}" title="Delete Current Item">
            <span class="material-icons" style="color: var(--danger-colour);">delete</span>
          </button>
          
          ${this.activeSection !== 'images' ? html`
          <button id="btn-header-save" class="secondary icon-button" @click="${() => this._dispatch('save-changes')}" ?disabled="${this.isSaving}" title="${this.isSaving ? 'Saving...' : 'Save Changes'}">
            <span class="material-icons">${this.isSaving ? 'sync' : 'save'}</span>
          </button>
          ` : ''}

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
