import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonStyles } from '../styles/common-styles';
import { Layout } from '../services/HaApiClient';

@customElement('app-toolbar')
export class AppToolbar extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        background: white;
        display: flex;
        flex: 1;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
      }
      .dropdown {
        position: relative;
        display: inline-block;
      }
      .dropdown-trigger {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: var(--border-radius);
        transition: background 0.2s;
      }
      .dropdown-trigger:hover { background: #f0f2f5; }
      .dropdown-trigger span { font-size: 1.1rem; font-weight: 700; color: #333; }
      .dropdown-trigger .chevron { font-size: 0.8rem; color: #666; transition: transform 0.2s; }
      .dropdown-trigger.active .chevron { transform: rotate(180deg); }
      
      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        min-width: 220px;
        box-shadow: var(--shadow-medium);
        border: 1px solid #eee;
        border-radius: 8px;
        margin-top: 0.5rem;
        z-index: 100;
        overflow: hidden;
        display: none;
      }
      .dropdown-menu.show {
        display: block;
        animation: slideIn 0.2s ease;
      }
      .dropdown-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
      }
      .dropdown-item:hover { background: #f0faff; color: var(--primary-colour); }
      .dropdown-item.selected { background: #e1f5fe; color: var(--primary-colour); font-weight: 600; }
      .dropdown-divider { height: 1px; background: #eee; margin: 4px 0; }
      .dropdown-item.action { color: var(--primary-colour); font-weight: 600; }

      .pos-value { color: var(--primary-colour); font-weight: 600; }
      .canvas-dim { padding-left: 1rem; border-left: 1px solid #ddd; }

      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .settings-button {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }
      .settings-button:hover {
        background: #e4e6e9;
        border-color: #ccc;
        color: #333;
      }
      .settings-button .material-icons {
        font-size: 20px;
      }
      
      .mouse-info { 
        font-size: 12px; 
        color: #666; 
        display: flex; 
        align-items: center; 
        gap: 1rem;
        margin-left: auto;
      }
    `
  ];

  @property({ type: Array }) layouts: Layout[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: Object }) mousePos: { x: number | null, y: number | null } = { x: null, y: null };

  @state() private _showMenu = false;

  private _handleGlobalClick?: (e: MouseEvent) => void;

  connectedCallback() {
    super.connectedCallback();
    this._handleGlobalClick = (e: MouseEvent) => {
      if (this._showMenu && !e.composedPath().some(el => (el as HTMLElement).classList?.contains('dropdown'))) {
        this._showMenu = false;
      }
    };
    window.addEventListener('click', this._handleGlobalClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._handleGlobalClick) {
      window.removeEventListener('click', this._handleGlobalClick);
    }
  }

  private _dispatch(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    this._showMenu = false;
  }

  render() {
    return html`
      <div class="toolbar-actions">
        <button class="settings-button" @click="${() => this._dispatch('edit-layout')}" title="Layout Settings">
          <span class="material-icons">settings</span>
        </button>

        <div class="dropdown">
          <div class="dropdown-trigger ${this._showMenu ? 'active' : ''}" @click="${() => this._showMenu = !this._showMenu}">
            <span>${this.activeLayout?.name || 'Loading...'}</span>
            <div class="chevron">▼</div>
          </div>
        <div class="dropdown-menu ${this._showMenu ? 'show' : ''}">
          ${this.layouts.map(l => html`
            <div class="dropdown-item ${this.activeLayout?.id === l.id ? 'selected' : ''}" @click="${() => this._dispatch('switch-layout', l)}">
              ${l.name}
              ${this.activeLayout?.id === l.id ? html`✓` : ''}
            </div>
          `)}
          <div class="dropdown-divider"></div>
          <div class="dropdown-item action" @click="${() => this._dispatch('create-layout')}">
            <span class="material-icons" style="font-size: 16px; margin-right: 8px;">add</span>
            Create new layout...
          </div>
          </div>
        </div>
      </div>

      <div class="mouse-info">
        ${this.mousePos.x !== null ? html`
          <span class="pos-value">X: ${this.mousePos.x}mm, Y: ${this.mousePos.y}mm</span>
        ` : ''}
        <span class="canvas-dim">
          Canvas: ${this.activeLayout?.canvas_width_mm}x${this.activeLayout?.canvas_height_mm}mm
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-toolbar': AppToolbar;
  }
}
