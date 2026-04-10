import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './shared/hardware-preview';
import { commonStyles } from '../styles/common-styles';

/**
 * Represents a single fixed-size display instance on the layout.
 */
@customElement('layout-box')
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
      :host([selected]) .container { border-color: var(--primary-colour); box-shadow: 0 0 0 2px rgba(3,169,244,0.3); z-index: 10; }
      :host([invalid]) .container { border-color: var(--danger-colour); background-color: rgba(244, 67, 54, 0.1); }
      
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
        top: -10px; right: -10px;
        display: flex; gap: 4px;
        opacity: 0; visibility: hidden;
        background: white; padding: 4px; border-radius: 4px;
        box-shadow: var(--shadow-small); z-index: 50;
      }
      :host(:hover) .actions { opacity: 1; visibility: visible; }
      
      .action-icon {
        cursor: pointer; color: #555; width: 20px; height: 20px;
        display: flex; align-items: center; justify-content: center;
      }
      .action-icon:hover { color: var(--primary-colour); }
      .action-icon.delete:hover { color: var(--danger-colour); }
      
      .item-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 60px;
        font-weight: 900;
        color: rgba(0, 0, 0, 0.15);
        pointer-events: none;
        z-index: 35;
        font-family: 'Outfit', sans-serif;
      }
    `
  ];

  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: Number }) width = 0;
  @property({ type: Number }) height = 0;
  @property({ type: Number }) orientation = 0; // 0 or 90
  @property({ type: Number }) itemIndex = 0;
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  
  // Hardware details
  @property({ type: Number }) border_width_mm = 0;
  @property({ type: Number }) panel_width_mm = 0;
  @property({ type: Number }) panel_height_mm = 0;
  @property({ type: String }) frame_colour = '';
  @property({ type: String }) mat_colour = '';

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    if (changedProperties.has('orientation') || changedProperties.has('width') || changedProperties.has('height')) {
      const isRotated = this.orientation === 90;
      this.style.width = `${isRotated ? this.height : this.width}px`;
      this.style.height = `${isRotated ? this.width : this.height}px`;
    }
  }

  private _dispatch(name: string) {
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
          .orientation="${this.orientation}"
        ></hardware-preview>

        <div class="item-number">
          ${this.itemIndex}
        </div>

        <div class="label">
          ${this.name} ${this.invalid ? '(Overlap!)' : ''}
        </div>

        <div class="actions">
          <div class="action-icon" title="Settings" @click="${() => this._dispatch('item-edit')}">
            <span class="material-icons" style="font-size: 16px;">settings</span>
          </div>
          <div class="action-icon" title="Rotate" @click="${(e: Event) => { e.stopPropagation(); this._dispatch('item-rotate'); }}">
            <span class="material-icons" style="font-size: 16px;">rotate_right</span>
          </div>
          <div class="action-icon delete" title="Delete" @click="${(e: Event) => { e.stopPropagation(); this._dispatch('item-delete'); }}">
            <span class="material-icons" style="font-size: 16px;">delete_outline</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'layout-box': LayoutBox;
  }
}
