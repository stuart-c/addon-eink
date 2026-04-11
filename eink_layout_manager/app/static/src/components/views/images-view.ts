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
    `
  ];

  @property({ type: Array }) images: Image[] = [];

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
    return html`
      <div class="image-card" @click="${() => this._handleImageClick(image)}">
        <div class="thumbnail-container">
          <img 
            src="/api/image/${image.id}/thumbnail" 
            alt="${image.name}"
            loading="lazy"
          >
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
}

declare global {
  interface HTMLElementTagNameMap {
    'images-view': ImagesView;
  }
}
