import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import interact from 'interactjs';
import './layout-box';
import { DisplayType, LayoutItem } from '../../services/HaApiClient';

/**
 * The main layout editor workspace.
 * Manages the arrangement of eInk display instances.
 */
@customElement('layout-editor')
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
    :host([noPadding]) {
      padding: 0;
    }
    :host([hidden]) {
      display: none !important;
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
    :host([readOnly]) .canvas::after {
      display: none;
    }
  `;

  @property({ type: Number }) width_mm = 500;
  @property({ type: Number }) height_mm = 500;
  @property({ type: Number }) gridSnap = 5;
  @property({ type: Array }) items: LayoutItem[] = [];
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Array }) selectedIds: string[] = [];
  @property({ type: Array }) highlightedIds: string[] = [];
  @property({ type: Array }) usedIds: string[] = [];
  @property({ type: Boolean, reflect: true }) readOnly = false;
  @property({ type: Boolean, reflect: true }) noPadding = false;
  
  // Preview properties
  @property({ type: Object }) previewImage: HTMLCanvasElement | string | null = null;
  @property({ type: Object }) previewTotalSize: { width: number; height: number } = { width: 0, height: 0 };
  
  @state() private _scale = 1;

  private _resizeObserver: ResizeObserver;

  constructor() {
    super();
    this._resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        this._updateScale(entries[0].contentRect);
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  protected firstUpdated() {
    this._setupInteractions();
    this._validateLayout();
    this._updateScale();
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('gridSnap') || changedProperties.has('items')) {
      this._setupInteractions();
      this._validateLayout();
    }
    if (changedProperties.has('width_mm') || changedProperties.has('height_mm')) {
      this._updateScale();
    }
  }

  private _updateScale(rect: DOMRectReadOnly | Partial<DOMRectReadOnly> | null = null) {
    // If no rect provided, fallback to current element dimensions
    if (!rect) {
      const bcr = this.getBoundingClientRect();
      rect = { width: bcr.width, height: bcr.height };
    }

    const padding = this.noPadding ? 0 : 80;
    const availableWidth = Math.max(0, (rect.width || 0) - padding);
    const availableHeight = Math.max(0, (rect.height || 0) - padding);
    
    if (availableWidth > 0 && availableHeight > 0) {
      const scaleX = availableWidth / this.width_mm;
      const scaleY = availableHeight / this.height_mm;
      // Auto-scale to fill available area, up to 4x zoom for large screens
      const newScale = Math.min(scaleX, scaleY, 4);
      
      // Only update if change is significant to avoid sub-pixel jitter
      if (Math.abs(this._scale - newScale) > 0.001) {
        this._scale = newScale;
      }
    }
  }

  private _setupInteractions() {
    const canvas = this.shadowRoot?.querySelector('.canvas') as HTMLElement;
    if (!canvas) return;

    // Clear existing interactions to avoid duplicates on re-init
    interact(canvas).unset();
    interact('layout-box', { context: this.shadowRoot as any }).unset();

    if (this.readOnly) return;

    // Layout boxes dragging
    interact('layout-box', { context: this.shadowRoot as any })
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
          move: (event: any) => {
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
              this._triggerRequestUpdate();
            }
          },
          end: (event: any) => {
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
    interact(canvas)
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
            canvas.classList.add('resizing');
          },
          move: (event: any) => {
            // Apply scale to dimension change
            this.width_mm = Math.round(event.rect.width / this._scale / this.gridSnap) * this.gridSnap;
            this.height_mm = Math.round(event.rect.height / this._scale / this.gridSnap) * this.gridSnap;
            
            // Explicitly trigger scale update during drag to maintain fit-to-screen
            this._updateScale();
            this._validateLayout();
          },
          end: () => {
            canvas.classList.remove('resizing');
            this.dispatchEvent(new CustomEvent('layout-resized', {
              detail: { width: this.width_mm, height: this.height_mm },
              bubbles: true,
              composed: true
            }));
          }
        }
      });
  }

  private _validateLayout() {
    this.items.forEach(i => i.invalid = false);

    for (let i = 0; i < this.items.length; i++) {
      const item1 = this.items[i];
      const dt1 = this.displayTypes.find(t => t.id === item1.display_type_id);
      if (!dt1) continue;

      const isPortrait = item1.orientation === 'portrait';
      const w1 = isPortrait ? dt1.height_mm : dt1.width_mm;
      const h1 = isPortrait ? dt1.width_mm : dt1.height_mm;

      // Check boundary overlap
      if (item1.x_mm < 0 || item1.y_mm < 0 || item1.x_mm + w1 > this.width_mm || item1.y_mm + h1 > this.height_mm) {
        item1.invalid = true;
      }
      for (let j = i + 1; j < this.items.length; j++) {
        const item1_check = this.items[i];
        const item2 = this.items[j];
        const dt1_check = this.displayTypes.find(t => t.id === item1_check.display_type_id);
        const dt2 = this.displayTypes.find(t => t.id === item2.display_type_id);

        if (!dt1_check || !dt2) continue;

        const isPortrait1 = item1_check.orientation === 'portrait';
        const w1_check = isPortrait1 ? dt1_check.height_mm : dt1_check.width_mm;
        const h1_check = isPortrait1 ? dt1_check.width_mm : dt1_check.height_mm;
        
        const isPortrait2 = item2.orientation === 'portrait';
        const w2 = isPortrait2 ? dt2.height_mm : dt2.width_mm;
        const h2 = isPortrait2 ? dt2.width_mm : dt2.height_mm;

        if (
          item1_check.x_mm < item2.x_mm + w2 &&
          item1_check.x_mm + w1_check > item2.x_mm &&
          item1_check.y_mm < item2.y_mm + h2 &&
          item1_check.y_mm + h1_check > item2.y_mm
        ) {
          item1_check.invalid = true;
          item2.invalid = true;
        }
      }
    }
  }

  private _triggerRequestUpdate() {
    this.items = [...this.items];
    this.requestUpdate();
  }

  private _handleBoxSelect(id: string) {
    if (this.readOnly) {
      this.dispatchEvent(new CustomEvent('box-click', { 
        detail: { id },
        bubbles: true,
        composed: true
      }));

      if (this.usedIds.includes(id)) return;
      // Toggle selection in read-only mode
      const newSelectedIds = this.selectedIds.includes(id)
        ? this.selectedIds.filter(i => i !== id)
        : [...this.selectedIds, id];
      
      this.dispatchEvent(new CustomEvent('selection-change', { 
        detail: { ids: newSelectedIds },
        bubbles: true,
        composed: true
      }));
    } else {
      this.dispatchEvent(new CustomEvent('select-item', { detail: { id } }));
    }
  }

  private _handleBoxEdit(id: string) {
    this.dispatchEvent(new CustomEvent('edit-item', { detail: { id } }));
  }

  private _handleMouseMove(e: MouseEvent) {
    const canvas = this.shadowRoot?.querySelector('.canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    // Correct mouse position for scale
    const x = (e.clientX - rect.left) / this._scale;
    const y = (e.clientY - rect.top) / this._scale;
    
    this.dispatchEvent(new CustomEvent('mouse-move', {
      detail: { x: Math.round(x), y: Math.round(y) },
      bubbles: true,
      composed: true
    }));
  }

  private _handleMouseLeave() {
    this.dispatchEvent(new CustomEvent('mouse-move', {
      detail: { x: null, y: null },
      bubbles: true,
      composed: true
    }));
  }

  private _handleBoxRotate(id: string) {
    this.dispatchEvent(new CustomEvent('rotate-item', { detail: { id } }));
  }

  private _handleBoxHover(id: string) {
    this.dispatchEvent(new CustomEvent('box-hover', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }

  private _handleBoxUnhover() {
    this.dispatchEvent(new CustomEvent('box-unhover', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const gridSize = this.gridSnap < 5 ? 10 : this.gridSnap;
    return html`
      <div class="viewport">
        <div class="scaling-container" style="width: ${this.width_mm * this._scale}px; height: ${this.height_mm * this._scale}px;">
          <div class="canvas-wrapper" style="transform: scale(${this._scale});">
            <div 
              class="canvas" 
              style="width: ${this.width_mm}px; height: ${this.height_mm}px; --grid-size: ${gridSize}px; --editor-scale: ${this._scale};"
              @mousemove="${this._handleMouseMove}"
              @mouseleave="${this._handleMouseLeave}"
            >
              <div class="grid-overlay"></div>
              ${repeat(this.items, (item) => item.id || Math.random().toString(), (item, index) => {
                const dt = this.displayTypes.find(t => t.id === item.display_type_id);
                if (!dt) return '';
                return html`
                  <layout-box
                    data-id="${item.id}"
                    .itemIndex="${index + 1}"
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
                    ?selected="${this.selectedIds.includes(item.id)}"
                    ?highlighted="${this.highlightedIds.includes(item.id)}"
                    ?invalid="${item.invalid}"
                    ?used="${this.usedIds.includes(item.id)}"
                    .readOnly="${this.readOnly}"
                    .previewImage="${this.previewImage}"
                    .previewOffset="${{ x: item.x_mm, y: item.y_mm }}"
                    .previewTotalSize="${this.previewTotalSize}"
                    @mousedown="${() => this._handleBoxSelect(item.id)}"
                    @dblclick="${() => this._handleBoxEdit(item.id)}"
                    @mouseenter="${() => this._handleBoxHover(item.id)}"
                    @mouseleave="${() => this._handleBoxUnhover()}"
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

declare global {
  interface HTMLElementTagNameMap {
    'layout-editor': LayoutEditor;
  }
}
