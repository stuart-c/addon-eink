import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { DisplayType, Layout } from '../../services/HaApiClient';
import '../shared/hardware-preview';

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
      
      .display-type-item {
        padding: 0.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: background 0.2s;
        border-bottom: 1px solid #f0f0f0;
      }
      .display-type-item:last-child { border-bottom: none; }
      .display-type-item:hover { background: #f0faff; }
      
      .display-type-preview {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        border-radius: 4px;
        flex-shrink: 0;
      }
      
      .display-type-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }
      .display-type-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: #333;
      }
      .display-type-meta {
        font-size: 0.75rem;
        color: #888;
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
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: Object }) mousePos: { x: number | null, y: number | null } = { x: null, y: null };

  @state() private _showMenu = false;
  @state() private _showDisplayMenu = false;

  private _handleGlobalClick?: (e: MouseEvent) => void;

  connectedCallback() {
    super.connectedCallback();
    this._handleGlobalClick = (e: MouseEvent) => {
      const path = e.composedPath();
      const isDropdown = path.some(el => (el as HTMLElement).classList?.contains('dropdown'));
      
      if (this._showMenu && !isDropdown) {
        this._showMenu = false;
      }
      if (this._showDisplayMenu && !isDropdown) {
        this._showDisplayMenu = false;
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
    this._showDisplayMenu = false;
  }

  render() {
    return html`
      <div class="toolbar-actions">
        <div class="dropdown">
          <button id="btn-add-display" class="settings-button" @click="${() => { this._showDisplayMenu = !this._showDisplayMenu; if (this._showDisplayMenu) this._showMenu = false; }}" title="Add Display Type">
            <span class="material-icons">add_box</span>
          </button>
          <div id="menu-display-types" class="dropdown-menu ${this._showDisplayMenu ? 'show' : ''}" style="min-width: 280px;">
            ${this.displayTypes.map(dt => html`
              <div class="display-type-item" @click="${() => this._dispatch('add-item-to-layout', dt)}">
                <div class="display-type-preview">
                  <hardware-preview
                    .width_mm="${dt.width_mm}"
                    .height_mm="${dt.height_mm}"
                    .border_width_mm="${dt.frame.border_width_mm}"
                    .panel_width_mm="${dt.panel_width_mm}"
                    .panel_height_mm="${dt.panel_height_mm}"
                    .frame_colour="${dt.frame.colour}"
                    .mat_colour="${dt.mat.colour}"
                    .scale="${40 / Math.max(dt.width_mm, dt.height_mm)}"
                  ></hardware-preview>
                </div>
                <div class="display-type-info">
                  <span class="display-type-name">${dt.name}</span>
                  <span class="display-type-meta">${dt.width_mm}x${dt.height_mm}mm | ${dt.colour_type}</span>
                </div>
              </div>
            `)}
          </div>
        </div>

        <button id="btn-layout-settings" class="settings-button" @click="${() => this._dispatch('edit-layout')}" title="Layout Settings">
          <span class="material-icons">settings</span>
        </button>

        <div class="dropdown">
          <div id="trigger-layouts" class="dropdown-trigger ${this._showMenu ? 'active' : ''}" @click="${() => { this._showMenu = !this._showMenu; if (this._showMenu) this._showDisplayMenu = false; }}">
            <span>${this.activeLayout?.name || 'Loading...'}</span>
            <div class="chevron">▼</div>
          </div>
          <div id="menu-layouts" class="dropdown-menu ${this._showMenu ? 'show' : ''}">
            ${this.layouts.map(l => html`
              <div class="dropdown-item ${this.activeLayout?.id === l.id ? 'selected' : ''}" @click="${() => this._dispatch('switch-layout', l)}">
                ${l.name}
                ${this.activeLayout?.id === l.id ? html`✓` : ''}
              </div>
            `)}
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
