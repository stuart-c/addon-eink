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
      position: absolute;
      top: -15px;
      right: -15px;
      display: flex;
      gap: 12px;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: white;
      padding: 6px 10px;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      z-index: 50;
      visibility: hidden;
      transform: scale(0.8);
    }
    :host(:hover) .actions {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
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
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 18px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
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
    invalid: { type: Boolean, reflect: true },
    
    // Hardware details
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
      // Visually swap w/h if rotated 90 degrees
      if (this.orientation === 90) {
        this.style.width = `${this.height}px`;
        this.style.height = `${this.width}px`;
      } else {
        this.style.width = `${this.width}px`;
        this.style.height = `${this.height}px`;
      }
    }

    if (changedProperties.has('frame_colour')) {
      this.style.borderColor = this.frame_colour || '#333';
      this.style.backgroundColor = this.frame_colour || '#333';
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

  _handleDeleteClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('item-delete', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const border = this.border_width_mm || 0;
    const matW = this.width - (2 * border);
    const matH = this.height - (2 * border);
    const panelW = this.panel_width_mm || 0;
    const panelH = this.panel_height_mm || 0;
    
    // Centering within the mat
    const cutoutX = (matW - panelW) / 2;
    const cutoutY = (matH - panelH) / 2;

    return html`
      <!-- Mat Layer -->
      <div 
        class="mat" 
        style="
          position: absolute;
          top: ${border}px;
          left: ${border}px;
          width: ${matW}px;
          height: ${matH}px;
          background-color: ${this.mat_colour || '#fff'};
          overflow: hidden;
        "
      >
        <!-- Display Panel Layer -->
        <div 
          class="panel" 
          style="
            position: absolute;
            top: ${cutoutY}px;
            left: ${cutoutX}px;
            width: ${panelW}px;
            height: ${panelH}px;
            background-color: #eee;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div class="label" style="font-size: 8px; opacity: 0.5;">
            ${this.orientation === 90 ? 'Rotated' : ''}
          </div>
        </div>
      </div>

      <div class="label" @dblclick="${this._handleDoubleClick}" style="z-index: 2; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
        ${this.name} ${this.invalid ? '(Overlap!)' : ''}
      </div>

      <div class="actions">
        <div class="action-icon" title="Open Settings" @click="${this._handleDoubleClick}">
          <span class="material-icons">settings</span>
        </div>
        <div class="action-icon" title="Rotate" @click="${this._handleRotateClick}">
          <span class="material-icons">rotate_right</span>
        </div>
        <div class="action-icon" title="Delete" style="color: #f44336;" @click="${this._handleDeleteClick}">
          <span class="material-icons">delete_outline</span>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define('layout-box', LayoutBox);
