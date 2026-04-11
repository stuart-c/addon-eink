import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Image } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/section-layout';
import '../shared/empty-view';

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
      }

      .sidebar-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 1rem;
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

  render() {
    return html`
      <section-layout>
        <div slot="left-bar" class="sidebar-content">
          <div class="sidebar-title">Library Filters</div>
          <p style="color: var(--text-muted); font-size: 13px;">
            Filtering coming soon.
          </p>
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
