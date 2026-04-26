import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import './layout-box';
import { LayoutEditorController } from '../../controllers/LayoutEditorController';

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
      min-width: 0;
      min-height: 0;
      background-color: var(--bg-light);
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
      box-shadow: var(--shadow-large);
      position: relative;
      border: 1px solid var(--border-colour);
      box-sizing: content-box; /* Match physical mm exactly */
    }
    .canvas.resizing {
      border-color: var(--primary-colour);
      box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2), var(--shadow-large);
    }
    .grid-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      background-image: 
      linear-gradient(to right, var(--border-colour-light) 1px, transparent 1px),
      linear-gradient(to bottom, var(--border-colour-light) 1px, transparent 1px);
      background-size: var(--grid-size, 10px) var(--grid-size, 10px);
    }
    /* Resize handles hints */
    .canvas::after {
      content: '';
      position: absolute;
      right: -5px; bottom: -5px;
      width: 15px; height: 15px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, var(--border-colour) 50%, var(--border-colour) 60%, transparent 60%, transparent 70%, var(--border-colour) 70%);
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
  @property({ type: Array }) items: any[] = [];
  @property({ type: Array }) displayTypes: any[] = [];
  @property({ type: Array }) selectedIds: string[] = [];
  @property({ type: Array }) highlightedIds: string[] = [];
  @property({ type: Array }) usedIds: string[] = [];
  @property({ type: Boolean, reflect: true }) readOnly = false;
  @property({ type: Boolean, reflect: true }) noPadding = false;
  @property({ type: Boolean }) hideNumber = false;
  @property({ type: Object }) previewImage: HTMLCanvasElement | string | null = null;
  @property({ type: Object }) previewTotalSize: { width: number; height: number } = { width: 0, height: 0 };
  @property({ type: Object }) previewSlices: Record<string, string> = {};
  
  public controller = new LayoutEditorController(this);

  private _resizeObserver: ResizeObserver;

  constructor() {
    super();
    this._resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        this.controller.updateScale(entries[0].contentRect);
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
    this._syncController();
    this.controller.setupInteractions(this.shadowRoot!);
  }

  protected updated(changedProperties: PropertyValues) {
    this._syncController();
    if (changedProperties.has('gridSnap') || changedProperties.has('items') || changedProperties.has('readOnly')) {
      this.controller.setupInteractions(this.shadowRoot!);
    }
  }

  private _syncController() {
    this.controller.initialise({
      width_mm: this.width_mm,
      height_mm: this.height_mm,
      gridSnap: this.gridSnap,
      items: this.items,
      displayTypes: this.displayTypes,
      selectedIds: this.selectedIds,
      highlightedIds: this.highlightedIds,
      usedIds: this.usedIds,
      readOnly: this.readOnly,
      noPadding: this.noPadding,
      hideNumber: this.hideNumber,
      previewImage: this.previewImage,
      previewTotalSize: this.previewTotalSize
    });
  }



  render() {
    const gridSize = this.gridSnap < 5 ? 10 : this.gridSnap;
    return html`
      <div class="viewport">
        <div class="scaling-container" style="width: ${this.width_mm * this.controller.scale}px; height: ${this.height_mm * this.controller.scale}px;">
          <div class="canvas-wrapper" style="transform: scale(${this.controller.scale});">
            <div 
              class="canvas" 
              style="width: ${this.width_mm}px; height: ${this.height_mm}px; --grid-size: ${gridSize}px; --editor-scale: ${this.controller.scale};"
              @mousemove="${(e: MouseEvent) => this.controller.handleMouseMove(e, this.shadowRoot!)}"
              @mouseleave="${() => this.controller.handleMouseLeave()}"
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
                    ?invalid="${this.controller.invalidItemIds.has(item.id)}"
                    .used="${this.usedIds.includes(item.id)}"
                    .readOnly="${this.readOnly}"
                    .hideNumber="${this.hideNumber}"
                    .previewImage="${this.previewSlices[item.id] || this.previewImage}"
                    .previewOffset="${{ x: item.x_mm, y: item.y_mm }}"
                    .previewTotalSize="${this.previewSlices[item.id] ? { width: 0, height: 0 } : this.previewTotalSize}"
                    @mousedown="${() => this.controller.handleBoxSelect(item.id)}"
                    @dblclick="${() => this.dispatchEvent(new CustomEvent('edit-item', { detail: { id: item.id } }))}"
                    @mouseenter="${() => this.dispatchEvent(new CustomEvent('box-hover', { detail: { id: item.id } }))}"
                    @mouseleave="${() => this.dispatchEvent(new CustomEvent('box-unhover'))}"
                    @item-edit="${() => this.dispatchEvent(new CustomEvent('edit-item', { detail: { id: item.id } }))}"
                    @item-rotate="${() => this.dispatchEvent(new CustomEvent('rotate-item', { detail: { id: item.id } }))}"
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
