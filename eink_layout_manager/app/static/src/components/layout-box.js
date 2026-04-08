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
    }
    .action-icon:hover {
      color: #03a9f4;
      transform: scale(1.2);
    }
    .action-icon svg {
      width: 18px;
      height: 18px;
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
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.97 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.97 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>
        </div>
        <div class="action-icon" title="Rotate" @click="${this._handleRotateClick}">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.24,10.13 6.6,9.3 7.11,8.53M18.41,7.11L17,8.53C17.5,9.3 17.86,10.13 18.01,11H20.03C19.86,9.61 19.3,8.27 18.41,7.11M11,4.07V6.09C11.87,6.24 12.7,6.6 13.47,7.11L14.89,5.7C13.73,4.8 12.39,4.24 11,4.07M10.11,18.31C9.3,18.01 8.53,17.5 7.84,16.81C7.11,16.08 6.5,15.19 6.07,14.23L4.17,14.9C4.7,16.15 5.5,17.29 6.42,18.22C7.35,19.14 8.41,19.86 9.58,20.32L10.11,18.31M14.23,19.93L14.9,18.03C14.03,17.88 13.2,17.52 12.43,17.01L10.97,18.5C11.96,19.16 13.06,19.64 14.23,19.93M17.01,12.43C17.52,13.2 17.88,14.03 18.03,14.9L19.93,14.23C19.64,13.06 19.16,11.96 18.5,10.97L17.01,12.43M16.81,16.16C16.16,17.15 15.3,18 14.27,18.64L15.36,20.36C16.66,19.56 17.75,18.47 18.57,17.17L16.81,16.16Z" /></svg>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define('layout-box', LayoutBox);
