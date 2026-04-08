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
      box-sizing: border-box;
      padding: 40px;
    }
    .viewport {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      min-height: 0;
    }
    .scaling-container {
      display: block;
      position: relative;
      flex-shrink: 0;
    }
    .canvas-wrapper {
      transform-origin: top left;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .canvas {
      background-color: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      position: relative;
      border: 1px solid #ccc;
      box-sizing: content-box; /* Match physical mm exactly */
    }
    .canvas.resizing {
      border-color: #03a9f4;
      box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2), 0 10px 30px rgba(0, 0, 0, 0.15);
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
    /* Resize handles hints */
    .canvas::after {
      content: '';
      position: absolute;
      right: -5px; bottom: -5px;
      width: 15px; height: 15px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, #ccc 50%, #ccc 60%, transparent 60%, transparent 70%, #ccc 70%);
      opacity: 0.5;
    }
    .canvas:hover::after { opacity: 1; }
  `;

  static properties = {
    width_mm: { type: Number },
    height_mm: { type: Number },
    gridSnap: { type: Number },
    items: { type: Array },
    displayTypes: { type: Array },
    selectedId: { type: String },
    _scale: { type: Number, state: true }
  };

  constructor() {
    super();
    this.width_mm = 500;
    this.height_mm = 500;
    this.gridSnap = 5;
    this.items = [];
    this.displayTypes = [];
    this.selectedId = null;
    this._scale = 1;
    this._resizeObserver = new ResizeObserver(() => this._updateScale());
  }

  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  firstUpdated() {
    this._setupInteractions();
    this._validateLayout();
    this._updateScale();
  }

  updated(changedProperties) {
    if (changedProperties.has('gridSnap') || changedProperties.has('items')) {
      this._setupInteractions();
      this._validateLayout();
    }
    if (changedProperties.has('width_mm') || changedProperties.has('height_mm')) {
      this._updateScale();
    }
  }

  _updateScale() {
    const rect = this.getBoundingClientRect();
    const padding = 80;
    const availableWidth = Math.max(0, rect.width - padding);
    const availableHeight = Math.max(0, rect.height - padding);
    
    if (availableWidth > 0 && availableHeight > 0) {
      const scaleX = availableWidth / this.width_mm;
      const scaleY = availableHeight / this.height_mm;
      // Auto-scale to fill available area, up to 4x zoom for large screens
      this._scale = Math.min(scaleX, scaleY, 4);
    }
  }

  _setupInteractions() {
    // Clear existing interactions to avoid duplicates on re-init
    interact(this.shadowRoot.querySelector('.canvas')).unset();
    interact('layout-box', { context: this.shadowRoot }).unset();

    // Layout boxes dragging
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
              // Apply scale to deltas
              const dx = event.dx / this._scale;
              const dy = event.dy / this._scale;

              const rawX = item.x_mm + dx;
              const rawY = item.y_mm + dy;
              
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

    // Canvas resizing
    interact(this.shadowRoot.querySelector('.canvas'))
      .resizable({
        edges: { right: true, bottom: true, left: false, top: false },
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: this.gridSnap, y: this.gridSnap })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          }),
          interact.modifiers.restrictSize({
            min: { width: 100, height: 100 }
          })
        ],
        listeners: {
          start: () => {
            this.shadowRoot.querySelector('.canvas').classList.add('resizing');
          },
          move: (event) => {
            // Apply scale to dimension change
            this.width_mm = Math.round(event.rect.width / this._scale / this.gridSnap) * this.gridSnap;
            this.height_mm = Math.round(event.rect.height / this._scale / this.gridSnap) * this.gridSnap;
            this._validateLayout();
          },
          end: () => {
            this.shadowRoot.querySelector('.canvas').classList.remove('resizing');
            this.dispatchEvent(new CustomEvent('layout-resized', {
              detail: { width: this.width_mm, height: this.height_mm },
              bubbles: true,
              composed: true
            }));
          }
        }
      });
  }

  _validateLayout() {
    this.items.forEach(i => i.invalid = false);

    for (let i = 0; i < this.items.length; i++) {
      const item1 = this.items[i];
      const dt1 = this.displayTypes.find(t => t.id === item1.display_type_id);
      if (!dt1) continue;

      const w1 = item1.orientation === 90 ? dt1.height_mm : dt1.width_mm;
      const h1 = item1.orientation === 90 ? dt1.width_mm : dt1.height_mm;

      // Check boundary overlap
      if (item1.x_mm < 0 || item1.y_mm < 0 || item1.x_mm + w1 > this.width_mm || item1.y_mm + h1 > this.height_mm) {
        item1.invalid = true;
      }
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
    const rect = this.shadowRoot.querySelector('.canvas').getBoundingClientRect();
    // Correct mouse position for scale
    const x = (e.clientX - rect.left) / this._scale;
    const y = (e.clientY - rect.top) / this._scale;
    
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

  _handleBoxRotate(id) {
    this.dispatchEvent(new CustomEvent('rotate-item', { detail: { id } }));
  }

  render() {
    const gridSize = this.gridSnap < 5 ? 10 : this.gridSnap;
    return html`
      <div class="viewport">
        <div class="scaling-container" style="width: ${this.width_mm * this._scale}px; height: ${this.height_mm * this._scale}px;">
          <div class="canvas-wrapper" style="transform: scale(${this._scale});">
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
                    .border_width_mm="${dt.frame?.border_width_mm || 0}"
                    .panel_width_mm="${dt.panel_width_mm}"
                    .panel_height_mm="${dt.panel_height_mm}"
                    .frame_colour="${dt.frame?.colour}"
                    .mat_colour="${dt.mat?.colour}"
                    ?selected="${this.selectedId === item.id}"
                    ?invalid="${item.invalid}"
                    @mousedown="${() => this._handleBoxSelect(item.id)}"
                    @item-edit="${() => this._handleBoxEdit(item.id)}"
                    @item-rotate="${() => this._handleBoxRotate(item.id)}"
                    @item-delete="${() => this.dispatchEvent(new CustomEvent('item-delete', { detail: { id: item.id } }))}"
                  ></layout-box>
                `;
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('layout-editor', LayoutEditor);
