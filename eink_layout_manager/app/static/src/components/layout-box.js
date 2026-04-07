import { LitElement, html, css } from 'lit';

/**
 * A draggable/resizable box within the layout editor.
 */
export class LayoutBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #03a9f4;
      background-color: var(--box-bg, rgba(3, 169, 244, 0.1));
      cursor: move;
      user-select: none;
      touch-action: none;
      transition: border-color 0.2s, background-color 0.2s;
    }
    :host([selected]) {
      border-color: #ff9800;
      background-color: rgba(255, 152, 0, 0.1);
      z-index: 10;
    }
    :host([invalid]) {
      border-color: #f44336;
      background-color: rgba(244, 67, 54, 0.1);
      animation: pulse 1s infinite alternate;
    }
    @keyframes pulse {
      from { box-shadow: 0 0 5px rgba(244, 67, 54, 0.5); }
      to { box-shadow: 0 0 15px rgba(244, 67, 54, 0.8); }
    }
    .resize-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #fff;
      border: 1px solid #03a9f4;
      right: -5px;
      bottom: -5px;
      cursor: nwse-resize;
    }
    :host([invalid]) .resize-handle {
      border-color: #f44336;
    }
    .label {
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 11px;
      background: #333;
      color: white;
      padding: 0 4px;
      white-space: nowrap;
      pointer-events: none;
      border-radius: 2px 2px 0 0;
    }
    :host([invalid]) .label {
      background: #f44336;
    }
  `;

  static properties = {
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    name: { type: String },
    colour: { type: String },
    selected: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
  };

  render() {
    return html`
      <div class="label">${this.name} ${this.invalid ? '(Overlap!)' : ''}</div>
      <div class="resize-handle"></div>
      <slot></slot>
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    if (changedProperties.has('width')) {
      this.style.width = `${this.width}px`;
    }
    if (changedProperties.has('height')) {
      this.style.height = `${this.height}px`;
    }
    if (changedProperties.has('colour')) {
      const colorMap = {
        'WHITE': 'rgba(255, 255, 255, 0.8)',
        'BLACK': 'rgba(0, 0, 0, 0.1)',
        'RED': 'rgba(255, 0, 0, 0.1)',
        'YELLOW': 'rgba(255, 255, 0, 0.1)',
        'GREEN': 'rgba(0, 255, 0, 0.1)',
        'BLUE': 'rgba(0, 0, 255, 0.1)',
      };
      this.style.setProperty('--box-bg', colorMap[this.colour] || 'rgba(3, 169, 244, 0.1)');
    }
  }
}

customElements.define('layout-box', LayoutBox);
