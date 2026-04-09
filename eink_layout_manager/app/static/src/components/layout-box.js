import { LitElement, html, css } from 'lit';
import './shared/hardware-preview.js';
import { commonStyles } from '../styles/common-styles.js';

export class LayoutBox extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        position: absolute;
        box-sizing: border-box;
        cursor: move;
        transition: transform 0.2s ease;
        overflow: visible;
      }
      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 2px solid #333;
        box-shadow: var(--shadow-small);
      }
      :host([selected]) .container { border-colour: var(--primary-colour); box-shadow: 0 0 0 2px rgba(3,169,244,0.3); z-index: 10; }
      :host([invalid]) .container { border-colour: var(--danger-colour); background-colour: rgba(244, 67, 54, 0.1); }
      
      .label {
        position: absolute;
        z-index: 5;
        font-size: 10px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        text-align: center;
        pointer-events: none;
      }
      
      .actions {
        position: absolute;
        top: -15px; right: -15px;
        display: flex; gap: 12px;
        opacity: 0; visibility: hidden;
        background: white; padding: 6px 10px; border-radius: 20px;
        box-shadow: var(--shadow-medium); z-index: 50;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: scale(0.8);
      }
      :host(:hover) .actions { opacity: 1; visibility: visible; transform: scale(1); }
      
      .action-icon {
        cursor: pointer; color: #555; width: 24px; height: 24px;
        display: flex; align-items: center; justify-content: center;
        transition: color 0.2s, transform 0.1s;
      }
      .action-icon:hover { color: var(--primary-colour); transform: scale(1.2); }
      .action-icon.delete:hover { color: var(--danger-colour); }
    `
  ];

  static properties = {
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    orientation: { type: Number },
    name: { type: String },
    selected: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    border_width_mm: { type: Number },
    panel_width_mm: { type: Number },
    panel_height_mm: { type: Number },
    frame_colour: { type: String },
    mat_colour: { type: String }
  };

  updated(changedProperties) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    if (changedProperties.has('orientation') || changedProperties.has('width') || changedProperties.has('height')) {
      const isRotated = this.orientation === 90;
      this.style.width = `${isRotated ? this.height : this.width}px`;
      this.style.height = `${isRotated ? this.width : this.height}px`;
    }
  }

  _dispatch(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="container" style="width: 100%; height: 100%;">
        <hardware-preview
          .width_mm="${this.width}"
          .height_mm="${this.height}"
          .border_width_mm="${this.border_width_mm}"
          .panel_width_mm="${this.panel_width_mm}"
          .panel_height_mm="${this.panel_height_mm}"
          .frame_colour="${this.frame_colour}"
          .mat_colour="${this.mat_colour}"
          .scale="${1}"
        ></hardware-preview>

        <div class="label">
          ${this.name} ${this.invalid ? '(Overlap!)' : ''}
        </div>

        <div class="actions">
          <div class="action-icon" title="Settings" @click="${() => this._dispatch('item-edit')}">
            <span class="material-icons" style="font-size: 16px;">settings</span>
          </div>
          <div class="action-icon" title="Rotate" @click="${(e) => { e.stopPropagation(); this._dispatch('item-rotate'); }}">
            <span class="material-icons" style="font-size: 16px;">rotate_right</span>
          </div>
          <div class="action-icon delete" title="Delete" @click="${(e) => { e.stopPropagation(); this._dispatch('item-delete'); }}">
            <span class="material-icons" style="font-size: 16px;">delete_outline</span>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('layout-box', LayoutBox);
