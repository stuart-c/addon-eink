import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Image } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/section-layout';
import '../shared/empty-view';
import '../shared/range-slider';
import '../shared/keyword-input';

/**
 * A view component for managing the Image Library.
 */
@customElement('images-view')
export class ImagesView extends LitElement {
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
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .image-card {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-small);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }

      .image-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-medium);
      }

      .image-card.selected {
        outline: 2px solid var(--primary-colour);
        background: #f0faff;
        box-shadow: var(--shadow-medium);
      }

      .thumbnail-container {
        aspect-ratio: 1 / 1;
        background-color: #f0f2f5;
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
        border-top: 1px solid var(--border-colour);
      }

      .image-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-colour);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }

      .image-meta {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 4px;
      }

      .sidebar-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: 100%;
        overflow-y: auto;
      }

      .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .sidebar-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .sidebar-title .material-icons {
        font-size: 14px;
      }

      .filter-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .reset-button {
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 8px;
        opacity: 0;
        visibility: hidden;
        background: white;
        padding: 6px;
        border-radius: 20px;
        box-shadow: var(--shadow-medium);
        z-index: 10;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: translateY(-5px) scale(0.9);
      }

      .image-card:hover .actions {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .action-icon {
        cursor: pointer;
        color: #555;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, transform 0.1s;
      }

      .action-icon:hover {
        color: var(--primary-colour);
        transform: scale(1.1);
      }
    `
  ];

  @property({ type: Array }) images: Image[] = [];
  @property({ type: String }) selectedImageId: string | null = null;

  get canDelete() {
    return !!this.selectedImageId;
  }

  public requestDelete() {
    const image = this.images.find(img => img.id === this.selectedImageId);
    if (image) {
      this.dispatchEvent(new CustomEvent('delete-image', {
        detail: { image },
        bubbles: true,
        composed: true
      }));
    }
  }

  @state() private _filterTitle = '';
  @state() private _filterDescription = '';
  @state() private _filterArtist = '';
  @state() private _filterCollection = '';
  @state() private _minWidth = 0;
  @state() private _maxWidth = 4000;
  @state() private _minHeight = 0;
  @state() private _maxHeight = 4000;
  @state() private _keywords: string[] = [];
  @state() private _sortBy = 'name:asc';

  private _resetFilters() {
    this._filterTitle = '';
    this._filterDescription = '';
    this._filterArtist = '';
    this._filterCollection = '';
    this._minWidth = 0;
    this._maxWidth = 4000;
    this._minHeight = 0;
    this._maxHeight = 4000;
    this._keywords = [];
    this._sortBy = 'name:asc';
  }

  render() {
    return html`
      <section-layout>
        <div slot="left-bar" class="sidebar-content">
          <!-- General Search -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">search</span>
              General Search
            </div>
            <div class="form-group">
              <label>Title / Name</label>
              <input 
                type="text" 
                placeholder="Search by title..."
                .value="${this._filterTitle}"
                @input="${(e: any) => this._filterTitle = e.target.value}"
              >
            </div>
            <div class="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="Search description..."
                .value="${this._filterDescription}"
                @input="${(e: any) => this._filterDescription = e.target.value}"
              >
            </div>
            <div class="filter-grid">
              <div class="form-group">
                <label>Artist</label>
                <input 
                  type="text" 
                  placeholder="Artist"
                  .value="${this._filterArtist}"
                  @input="${(e: any) => this._filterArtist = e.target.value}"
                >
              </div>
              <div class="form-group">
                <label>Collection</label>
                <input 
                  type="text" 
                  placeholder="Collection"
                  .value="${this._filterCollection}"
                  @input="${(e: any) => this._filterCollection = e.target.value}"
                >
              </div>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">aspect_ratio</span>
              Dimensions (px)
            </div>
            <range-slider
              label="Width"
              .min="${0}"
              .max="${4000}"
              .valueLow="${this._minWidth}"
              .valueHigh="${this._maxWidth}"
              @range-change="${(e: CustomEvent) => {
                this._minWidth = e.detail.low;
                this._maxWidth = e.detail.high;
              }}"
            ></range-slider>
            <range-slider
              label="Height"
              .min="${0}"
              .max="${4000}"
              .valueLow="${this._minHeight}"
              .valueHigh="${this._maxHeight}"
              @range-change="${(e: CustomEvent) => {
                this._minHeight = e.detail.low;
                this._maxHeight = e.detail.high;
              }}"
            ></range-slider>
          </div>

          <!-- Classification -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">sell</span>
              Classification
            </div>
            <div class="form-group">
              <label>Keywords</label>
              <keyword-input
                .keywords="${this._keywords}"
                .validate="${true}"
                @keywords-changed="${(e: CustomEvent) => this._keywords = e.detail.keywords}"
              ></keyword-input>
            </div>
          </div>

          <!-- Sorting -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <span class="material-icons">sort</span>
              Sorting
            </div>
            <div class="form-group">
              <select 
                .value="${this._sortBy}"
                @change="${(e: any) => this._sortBy = e.target.value}"
              >
                <option value="name:asc">Name (A-Z)</option>
                <option value="name:desc">Name (Z-A)</option>
                <option value="artist:asc">Artist (A-Z)</option>
                <option value="artist:desc">Artist (Z-A)</option>
                <option value="width:desc">Widest First</option>
                <option value="width:asc">Narrowest First</option>
                <option value="height:desc">Tallest First</option>
                <option value="height:asc">Shortest First</option>
              </select>
            </div>
          </div>

          <!-- Reset -->
          <div class="reset-button">
            <button class="secondary" style="width: 100%;" @click="${this._resetFilters}">
              <span class="material-icons">filter_alt_off</span>
              Reset Filters
            </button>
          </div>
        </div>

        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          Image Library
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
}

declare global {
  interface HTMLElementTagNameMap {
    'images-view': ImagesView;
  }
}
