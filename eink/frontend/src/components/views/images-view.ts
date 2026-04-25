import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Image } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import { BaseResourceView } from './base-resource-view';
import '../shared/section-layout';
import '../shared/empty-view';
import '../shared/range-slider';
import '../shared/keyword-input';

import { ImagesViewController, SortField, SortConfig } from '../../controllers/ImagesViewController';
import { HaStateController } from '../../controllers/HaStateController';

/**
 * A view component for managing the Image Library.
 */
@customElement('images-view')
export class ImagesView extends BaseResourceView {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.25rem;
        padding: 1.25rem;
      }

      .image-card {
        background: white;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-small);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }

      .image-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
        border-color: var(--primary-colour);
      }

      .image-card.selected {
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 2px var(--primary-colour), var(--shadow-medium);
        background: rgba(3, 169, 244, 0.05);
      }

      .thumbnail-container {
        aspect-ratio: 1 / 1;
        background-color: var(--border-colour-light);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
      }

      .thumbnail-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .image-info {
        padding: 0.75rem;
        border-top: 1px solid var(--border-colour-light);
      }

      .image-name {
        font-size: 14px;
        font-weight: var(--font-weight-semi-bold);
        color: var(--text-colour);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }

      .image-meta {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 4px;
        font-weight: 500;
      }

      .sidebar-content {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
        overflow-y: auto;
      }

      .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .reset-button {
        margin-top: auto;
        padding-top: 1.25rem;
        border-top: 1px solid var(--border-colour);
      }

      .actions {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 6px;
        opacity: 0;
        visibility: hidden;
        background: white;
        padding: 4px;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        z-index: 10;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: translateY(-5px) scale(0.9);
        border: 1px solid var(--border-colour);
      }

      .image-card:hover .actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .action-icon {
        cursor: pointer;
        color: var(--text-muted);
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        border-radius: 6px;
      }

      .action-icon:hover {
        color: var(--primary-colour);
        background: var(--bg-light);
      }

      .sort-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .sort-item {
        display: flex;
        align-items: center;
        background: white;
        padding: 8px 10px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        gap: 8px;
        font-size: 13px;
        color: var(--text-colour);
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      }

      .sort-item.drag-over {
        border-top: 2px solid var(--primary-colour);
      }

      .sort-item .field-label {
        flex: 1;
        font-weight: 500;
        cursor: default;
      }

      .sort-item .sort-actions {
        display: flex;
        gap: 4px;
      }

      .sort-action {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-muted);
        border-radius: 4px;
        transition: all 0.2s;
      }

      .sort-action:hover {
        background: var(--bg-light);
        color: var(--primary-colour);
      }

      .sort-action.remove:hover {
        color: var(--danger-colour);
      }

      .add-sort-container {
        position: relative;
        margin-top: 0.5rem;
      }

      .add-sort-button {
        width: 100%;
        font-size: 12px;
        padding: 0 12px;
        height: 32px;
      }

      .add-sort-menu {
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 100;
        margin-bottom: 4px;
        overflow: hidden;
      }

      .add-sort-item {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      }

      .add-sort-item:hover {
        background: var(--bg-light);
        color: var(--primary-colour);
      }
    `
  ];

  @property({ type: Object }) state!: HaStateController;
  @property({ type: Array }) images: Image[] = [];
  @property({ type: String }) selectedImageId: string | null = null;

  public controller = new ImagesViewController(this);
  @state() private _draggedIndex: number | null = null;
  @state() private _dragOverIndex: number | null = null;

  protected willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedImageId')) {
      this.notifyCanDelete(!!this.selectedImageId);
    }
  }

  get isDirty() {
    return false;
  }

  protected firstUpdated() {
    this.notifyDirty(false);
  }

  public save() {
    // Images are currently saved via dialog-driven upload, no inline saving yet.
  }

  public discard() {
    // No inline discard logic needed for the grid view.
  }

  public addNew() {
    // Handled via image-dialog triggered by app-root.
  }

  public requestDelete() {
    const image = this.images.find(img => img.id === this.selectedImageId);
    if (image) {
      this.controller.deleteImage(image);
    }
  }

  get canDelete() {
    return !!this.selectedImageId;
  }

  render() {
    return html`
      <section-layout>
        <div slot="left-bar" class="sidebar-content">
          <!-- General Search -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <span class="material-icons">search</span>
              General Search
            </div>
            <div class="form-group">
              <label>Title / Name</label>
              <input 
                type="text" 
                placeholder="Search by title..."
                .value="${this.controller.filterTitle}"
                @input="${(e: any) => { 
                  this.controller.filterTitle = e.target.value;
                  this.controller.triggerFilterChange();
                }}"
              >
            </div>
            <div class="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="Search description..."
                .value="${this.controller.filterDescription}"
                @input="${(e: any) => {
                  this.controller.filterDescription = e.target.value;
                  this.controller.triggerFilterChange();
                }}"
              >
            </div>
            <div class="form-group">
              <label>Artist</label>
              <input 
                type="text" 
                placeholder="Artist"
                .value="${this.controller.filterArtist}"
                @input="${(e: any) => {
                  this.controller.filterArtist = e.target.value;
                  this.controller.triggerFilterChange();
                }}"
              >
            </div>
            <div class="form-group">
              <label>Collection</label>
              <input 
                type="text" 
                placeholder="Collection"
                .value="${this.controller.filterCollection}"
                @input="${(e: any) => {
                  this.controller.filterCollection = e.target.value;
                  this.controller.triggerFilterChange();
                }}"
              >
            </div>
          </div>

          <!-- Dimensions -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <span class="material-icons">aspect_ratio</span>
              Dimensions (px)
            </div>
            <range-slider
              label="Width"
              .min="${0}"
              .max="${4000}"
              .valueLow="${this.controller.minWidth}"
              .valueHigh="${this.controller.maxWidth}"
              @range-change="${(e: CustomEvent) => {
                this.controller.minWidth = e.detail.low;
                this.controller.maxWidth = e.detail.high;
                this.controller.triggerFilterChange(true);
              }}"
            ></range-slider>
            <range-slider
              label="Height"
              .min="${0}"
              .max="${4000}"
              .valueLow="${this.controller.minHeight}"
              .valueHigh="${this.controller.maxHeight}"
              @range-change="${(e: CustomEvent) => {
                this.controller.minHeight = e.detail.low;
                this.controller.maxHeight = e.detail.high;
                this.controller.triggerFilterChange(true);
              }}"
            ></range-slider>
          </div>

          <!-- Classification -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <span class="material-icons">sell</span>
              Classification
            </div>
            <div class="form-group">
              <label>Keywords</label>
              <keyword-input
                .keywords="${this.controller.keywords}"
                .validate="${true}"
                @keywords-changed="${(e: CustomEvent) => {
                  this.controller.keywords = e.detail.keywords;
                  this.controller.triggerFilterChange(true);
                }}"
              ></keyword-input>
            </div>
          </div>

          <!-- Sorting -->
          <div class="sidebar-section">
            <div class="sidebar-section-title">
              <span class="material-icons">sort</span>
              Sort Priority
            </div>
            
            <div class="sort-list">
              ${this.controller.sortFields.map((sort, index) => this._renderSortItem(sort, index))}
            </div>

            <div class="add-sort-container">
              <button 
                class="secondary add-sort-button" 
                ?disabled="${this._getAvailableFields().length === 0}"
                @click="${() => { this.controller.isAddMenuOpen = !this.controller.isAddMenuOpen; this.requestUpdate(); }}"
              >
                <span class="material-icons" style="font-size: 16px;">add</span>
                Add Sort Field
              </button>
              
              ${this.controller.isAddMenuOpen ? html`
                <div class="add-sort-menu">
                  ${this._getAvailableFields().map(field => html`
                    <div class="add-sort-item" @click="${() => this.controller.addSortField(field)}">
                      ${this._getFieldLabel(field)}
                    </div>
                  `)}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Reset -->
          <div class="reset-button">
            <button class="secondary" style="width: 100%;" @click="${() => this.controller.resetFilters()}">
              <span class="material-icons">filter_alt_off</span>
              Reset Filters
            </button>
          </div>
        </div>

        <div slot="right-top-bar" class="toolbar-content">
          <div class="toolbar-title">Image Library</div>
        </div>

        <div slot="right-main">
          ${this.images.length === 0 ? html`
            <empty-view 
              title="No Images Found"
              icon="image"
              message="Upload images to start building your library."
            ></empty-view>
          ` : html`
            <div class="image-grid">
              ${this.images.map(image => this._renderImage(image))}
            </div>
          `}
        </div>
      </section-layout>
    `;
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('images')) {
      console.info(`[ImagesView] images property changed. New length: ${this.images?.length ?? 'undefined'}`);
      console.debug('[ImagesView] Current images:', this.images);
    }
  }

  private _renderImage(image: Image) {
    const isSelected = image.id === this.selectedImageId;
    return html`
      <div 
        class="image-card ${isSelected ? 'selected' : ''}" 
        @click="${() => this._handleImageClick(image)}"
        @dblclick="${(e: MouseEvent) => this._handleEditImage(image, e)}"
      >
        <div class="thumbnail-container">
          <img 
            src="/api/image/${image.id}/thumbnail" 
            alt="${image.name}"
            loading="lazy"
          >
          <div class="actions">
            <div 
              class="action-icon" 
              title="Edit Metadata" 
              @click="${(e: MouseEvent) => this._handleEditImage(image, e)}"
            >
              <span class="material-icons" style="font-size: 18px;">settings</span>
            </div>
          </div>
        </div>
        <div class="image-info">
          <p class="image-name" title="${image.name}">${image.name}</p>
          <div class="image-meta">
            ${image.dimensions.width} &times; ${image.dimensions.height} &bull; ${image.file_type}
          </div>
        </div>
      </div>
    `;
  }

  private _handleImageClick(image: Image) {
    this.dispatchEvent(new CustomEvent('image-click', {
      detail: { image },
      bubbles: true,
      composed: true
    }));
  }

  private _handleEditImage(image: Image, e: MouseEvent) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('edit-image', {
      detail: { image },
      bubbles: true,
      composed: true
    }));
  }

  private _renderSortItem(sort: SortConfig, index: number) {
    const isDragging = this._draggedIndex === index;
    const isDragOver = this._dragOverIndex === index;

    return html`
      <div 
        class="sort-item draggable-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}"
        draggable="true"
        @dragstart="${(e: DragEvent) => this._onDragStart(e, index)}"
        @dragover="${(e: DragEvent) => this._onDragOver(e, index)}"
        @dragleave="${() => this._dragOverIndex = null}"
        @dragend="${this._onDragEnd}"
        @drop="${(e: DragEvent) => this._onDrop(e, index)}"
      >
        <span class="material-icons drag-handle">drag_indicator</span>
        <span class="field-label">${this._getFieldLabel(sort.field)}</span>
        <div class="sort-actions">
          <div class="sort-action" @click="${() => this.controller.toggleSortDirection(index)}">
            <span class="material-icons">
              ${sort.direction === 'asc' ? 'north' : 'south'}
            </span>
          </div>
          <div class="sort-action remove" @click="${() => this.controller.removeSortField(index)}">
            <span class="material-icons">close</span>
          </div>
        </div>
      </div>
    `;
  }

  private _getFieldLabel(field: SortField): string {
    const labels: Record<SortField, string> = {
      name: 'Name',
      artist: 'Artist',
      collection: 'Collection',
      width: 'Width',
      height: 'Height'
    };
    return labels[field];
  }

  private _getAvailableFields(): SortField[] {
    const allFields: SortField[] = ['name', 'artist', 'collection', 'width', 'height'];
    const activeFields = this.controller.sortFields.map(s => s.field);
    return allFields.filter(f => !activeFields.includes(f));
  }

  private _onDragStart(e: DragEvent, index: number) {
    this._draggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  }

  private _onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (this._draggedIndex === index) return;
    this._dragOverIndex = index;
  }

  private _onDragEnd() {
    this._draggedIndex = null;
    this._dragOverIndex = null;
  }

  private _onDrop(e: DragEvent, index: number) {
    e.preventDefault();
    this._dragOverIndex = null;
    
    if (this._draggedIndex === null || this._draggedIndex === index) return;

    this.controller.reorderSortFields(this._draggedIndex, index);
    this._draggedIndex = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'images-view': ImagesView;
  }
}
