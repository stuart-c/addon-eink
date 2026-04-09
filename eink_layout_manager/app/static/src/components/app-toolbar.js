import { LitElement, html, css } from 'lit';
import { commonStyles } from '../styles/common-styles.js';

export class AppToolbar extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        padding: 0.75rem 1.5rem;
        background: white;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .dropdown { position: relative; display: inline-block; }
      .dropdown-trigger {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: var(--border-radius);
        transition: background 0.2s;
      }
      .dropdown-trigger:hover { background: var(--bg-light); }
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
      .dropdown-menu.show { display: block; animation: slideIn 0.2s ease; }
      
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
      .dropdown-item:hover { background: #f0faff; color: var(--primary-color); }
      .dropdown-item.selected { background: #e1f5fe; color: var(--primary-color); font-weight: 600; }
      .dropdown-divider { height: 1px; background: #eee; margin: 4px 0; }
      .dropdown-item.action { color: var(--primary-color); font-weight: 600; }

      .stats { font-size: 12px; color: #666; display: flex; align-items: center; gap: 1rem; }
      .pos-highlight { color: var(--primary-color); font-weight: 600; }
      .divider { padding-left: 1rem; border-left: 1px solid #ddd; }

      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
  ];

  static properties = {
    layouts: { type: Array },
    activeLayout: { type: Object },
    mousePos: { type: Object },
    _showMenu: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._showMenu = false;
    this._handleGlobalClick = (e) => {
      if (this._showMenu && !e.composedPath().some(el => el.classList?.contains('dropdown'))) {
        this._showMenu = false;
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this._handleGlobalClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this._handleGlobalClick);
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    this._showMenu = false;
  }

  render() {
    return html`
      <div class="dropdown">
        <div class="dropdown-trigger ${this._showMenu ? 'active' : ''}" @click="${(e) => { e.stopPropagation(); this._showMenu = !this._showMenu; }}">
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
      
      <div class="stats">
        ${this.mousePos?.x !== null ? html`
          <span class="pos-highlight">X: ${this.mousePos.x}mm, Y: ${this.mousePos.y}mm</span>
        ` : ''}
        <span class="${this.mousePos?.x !== null ? 'divider' : ''}">
          Canvas: ${this.activeLayout?.canvas_width_mm}x${this.activeLayout?.canvas_height_mm}mm
        </span>
      </div>
    `;
  }
}

customElements.define('app-toolbar', AppToolbar);
