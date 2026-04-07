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
      background-color: rgba(3, 169, 244, 0.1);
      cursor: move;
      user-select: none;
      touch-action: none;
    }
    :host([selected]) {
      border-color: #ff9800;
      background-color: rgba(255, 152, 0, 0.1);
      z-index: 10;
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
    .label {
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 12px;
      background: #03a9f4;
      color: white;
      padding: 0 4px;
      white-space: nowrap;
      pointer-events: none;
    }
  `;

  static properties = {
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    name: { type: String },
    selected: { type: Boolean, reflect: true },
  };

  render() {
    return html`
      <div class="label">${this.name}</div>
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
  }
}

customElements.define('layout-box', LayoutBox);
