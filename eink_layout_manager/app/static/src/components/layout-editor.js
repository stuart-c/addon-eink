import { LitElement, html, css } from 'lit';
import interact from 'interactjs';
import './layout-box.js';

/**
 * The main layout editor workspace.
 * Manages the arrangement of eInk display instances.
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
    .canvas {
      background-color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      border: 1px solid #ccc;
    }
    .grid-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      background-image: 
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
      background-size: var(--grid-size, 10px) var(--grid-size, 10px);
    }
  `;

  static properties = {
    width_mm: { type: Number },
    height_mm: { type: Number },
    gridSnap: { type: Number },
    items: { type: Array },
    displayTypes: { type: Array },
    selectedId: { type: String },
  };

  constructor() {
    super();
    this.width_mm = 500;
    this.height_mm = 500;
    this.gridSnap = 5;
    this.items = [];
    this.displayTypes = [];
    this.selectedId = null;
  }

  firstUpdated() {
    this._setupInteractions();
  }

  updated(changedProperties) {
    if (changedProperties.has('gridSnap')) {
      this._setupInteractions();
    }
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
            targets: [interact.snappers.grid({ x: this.gridSnap, y: this.gridSnap })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          })
        ],
        listeners: {
          move: (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const item = this.items.find(i => i.id === id);
            
            if (item) {
              // Calculate raw new position
              const rawX = item.x_mm + event.dx;
              const rawY = item.y_mm + event.dy;
              
              // Force snap to grid and ensure integer values
              item.x_mm = Math.round(rawX / this.gridSnap) * this.gridSnap;
              item.y_mm = Math.round(rawY / this.gridSnap) * this.gridSnap;

              target.x = item.x_mm;
              target.y = item.y_mm;
              this._validateLayout();
              this._requestUpdate();
            }
          },
          end: (event) => {
             const id = event.target.getAttribute('data-id');
             const item = this.items.find(i => i.id === id);
             if (item) {
                this.dispatchEvent(new CustomEvent('item-moved', {
                  detail: { id, x: item.x_mm, y: item.y_mm },
                  bubbles: true,
                  composed: true
                }));
             }
          }
        }
      });
      // Resizable is removed as displays have fixed hardware sizes
  }

  _validateLayout() {
    // Reset validity
    this.items.forEach(i => i.invalid = false);

    // Check for overlaps
    for (let i = 0; i < this.items.length; i++) {
      for (let j = i + 1; j < this.items.length; j++) {
        const item1 = this.items[i];
        const item2 = this.items[j];
        const dt1 = this.displayTypes.find(t => t.id === item1.display_type_id);
        const dt2 = this.displayTypes.find(t => t.id === item2.display_type_id);

        if (!dt1 || !dt2) continue;

        const w1 = item1.orientation === 90 ? dt1.height_mm : dt1.width_mm;
        const h1 = item1.orientation === 90 ? dt1.width_mm : dt1.height_mm;
        const w2 = item2.orientation === 90 ? dt2.height_mm : dt2.width_mm;
        const h2 = item2.orientation === 90 ? dt2.width_mm : dt2.height_mm;

        if (
          item1.x_mm < item2.x_mm + w2 &&
          item1.x_mm + w1 > item2.x_mm &&
          item1.y_mm < item2.y_mm + h2 &&
          item1.y_mm + h1 > item2.y_mm
        ) {
          item1.invalid = true;
          item2.invalid = true;
        }
      }
    }
  }

  _requestUpdate() {
    this.items = [...this.items];
    this.requestUpdate();
  }

  _handleBoxSelect(id) {
    this.dispatchEvent(new CustomEvent('select-item', { detail: { id } }));
  }

  _handleBoxEdit(id) {
    this.dispatchEvent(new CustomEvent('edit-item', { detail: { id } }));
  }

  _handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.dispatchEvent(new CustomEvent('mouse-move', {
      detail: { x: Math.round(x), y: Math.round(y) },
      bubbles: true,
      composed: true
    }));
  }

  _handleMouseLeave() {
    this.dispatchEvent(new CustomEvent('mouse-move', {
      detail: { x: null, y: null },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const gridSize = this.gridSnap < 5 ? 10 : this.gridSnap;
    return html`
      <div 
        class="canvas" 
        style="width: ${this.width_mm}px; height: ${this.height_mm}px; --grid-size: ${gridSize}px;"
        @mousemove="${this._handleMouseMove}"
        @mouseleave="${this._handleMouseLeave}"
      >
        <div class="grid-overlay"></div>
        ${this.items.map(item => {
          const dt = this.displayTypes.find(t => t.id === item.display_type_id);
          if (!dt) return '';
          return html`
            <layout-box
              data-id="${item.id}"
              .x="${item.x_mm}"
              .y="${item.y_mm}"
              .width="${dt.width_mm}"
              .height="${dt.height_mm}"
              .orientation="${item.orientation}"
              .name="${dt.name}"
              ?selected="${this.selectedId === item.id}"
              ?invalid="${item.invalid}"
              @mousedown="${() => this._handleBoxSelect(item.id)}"
              @item-edit="${() => this._handleBoxEdit(item.id)}"
            ></layout-box>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('layout-editor', LayoutEditor);
