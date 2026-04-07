import { LitElement, html, css } from 'lit';
import interact from 'interactjs';
import './layout-box.js';

/**
 * The main layout editor workspace.
 * Manages the display area and interaction logic for layout boxes.
 */
export class LayoutEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #f5f5f5;
      overflow: auto;
      padding: 2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .display-container {
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      border: 1px solid #ccc;
    }
    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background-image: 
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `;

  static properties = {
    width_px: { type: Number },
    height_px: { type: Number },
    boxes: { type: Array },
    _selectedId: { type: String },
  };

  constructor() {
    super();
    this.width_px = 800;
    this.height_px = 480;
    this.boxes = [];
    this._selectedId = null;
  }

  firstUpdated() {
    this._setupInteractions();
  }

  _setupInteractions() {
    interact('layout-box', { context: this.shadowRoot })
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          }),
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: 5, y: 5 })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          })
        ],
        listeners: {
          move: (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const box = this.boxes.find(b => b.id === id);
            
            if (box) {
              box.x += event.dx;
              box.y += event.dy;
              target.x = box.x;
              target.y = box.y;
              this._requestUpdate();
            }
          },
          end: () => this._emitChange()
        }
      })
      .resizable({
        edges: { right: '.resize-handle', bottom: '.resize-handle' },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          interact.modifiers.restrictSize({
            min: { width: 20, height: 20 }
          }),
          interact.modifiers.snapSize({
            targets: [interact.snappers.grid({ x: 5, y: 5 })]
          })
        ],
        listeners: {
          move: (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const box = this.boxes.find(b => b.id === id);

            if (box) {
              box.width = event.rect.width;
              box.height = event.rect.height;
              target.width = box.width;
              target.height = box.height;
              this._requestUpdate();
            }
          },
          end: () => this._emitChange()
        }
      });
  }

  _requestUpdate() {
    this.boxes = [...this.boxes];
    this.requestUpdate();
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('layout-changed', {
      detail: { boxes: this.boxes },
      bubbles: true,
      composed: true
    }));
  }

  _handleBoxSelect(id) {
    this._selectedId = id;
  }

  render() {
    return html`
      <div class="display-container" style="width: ${this.width_px}px; height: ${this.height_px}px;">
        <div class="grid-overlay"></div>
        ${this.boxes.map(box => html`
          <layout-box
            data-id="${box.id}"
            .x="${box.x}"
            .y="${box.y}"
            .width="${box.width}"
            .height="${box.height}"
            .name="${box.name}"
            ?selected="${this._selectedId === box.id}"
            @mousedown="${() => this._handleBoxSelect(box.id)}"
          ></layout-box>
        `)}
      </div>
    `;
  }
}

customElements.define('layout-editor', LayoutEditor);
