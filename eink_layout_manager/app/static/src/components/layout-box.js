import { LitElement, html, css } from 'lit';

/**
 * Represents a single fixed-size display instance on the layout.
 */
export class LayoutBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      border: 2px solid #333;
      background-color: rgba(255, 255, 255, 0.9);
      cursor: move;
      transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: visible;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    :host([selected]) {
      border-color: #03a9f4;
      box-shadow: 0 0 0 2px rgba(3,169,244,0.3);
      z-index: 10;
    }
    :host([invalid]) {
      border-color: #f44336;
      background-color: rgba(244, 67, 54, 0.1);
    }
    .label {
      font-size: 10px;
      font-weight: 700;
      color: #333;
      text-align: center;
      pointer-events: none;
      word-break: break-all;
      padding: 4px;
      margin-bottom: 2px;
    }
    .orientation-marker {
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: 8px;
      color: #999;
    }
    .actions {
      display: flex;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.2s ease;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px 8px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }
    :host(:hover) .actions {
      opacity: 1;
    }
    .action-icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #555;
      transition: color 0.2s, transform 0.1s;
      width: 24px;
      height: 24px;
    }
    .action-icon:hover {
      color: #03a9f4;
      transform: scale(1.2);
    }
    .material-icons {
      font-size: 18px;
      user-select: none;
    }
  `;

  static properties = {
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    orientation: { type: Number }, // 0 or 90
    name: { type: String },
    selected: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true }
  };

  updated(changedProperties) {
    if (changedProperties.has('x') || changedProperties.has('y')) {
      this.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    if (changedProperties.has('orientation') || changedProperties.has('width') || changedProperties.has('height')) {
      // Visually swap w/h if rotated 90 degrees
      if (this.orientation === 90) {
        this.style.width = `${this.height}px`;
        this.style.height = `${this.width}px`;
      } else {
        this.style.width = `${this.width}px`;
        this.style.height = `${this.height}px`;
      }
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

  _handleDoubleClick(e) {
    this.dispatchEvent(new CustomEvent('item-edit', { 
      bubbles: true, 
      composed: true 
    }));
  }

  _handleRotateClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('item-rotate', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="label" @dblclick="${this._handleDoubleClick}">${this.name} ${this.invalid ? '(Overlap!)' : ''}</div>
      <div class="actions">
        <div class="action-icon" title="Open Settings" @click="${this._handleDoubleClick}">
          <span class="material-icons">settings</span>
        </div>
        <div class="action-icon" title="Rotate" @click="${this._handleRotateClick}">
          <span class="material-icons">rotate_right</span>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define('layout-box', LayoutBox);
