import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { Layout, DisplayType, Image as ImageMetadata, api } from '../../services/HaApiClient';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import '../layout/layout-editor';
import { SceneItemSettingsController } from '../../controllers/SceneItemSettingsController';

/**
 * A dialog component for editing the settings of an item in a scene.
 * It features a three-column layout for image selection, preview, and mapping controls.
 */
@customElement('scene-item-settings-dialog')
export class SceneItemSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        --dialog-width: 1100px;
      }

      .dialog-content {
        display: grid;
        grid-template-columns: 280px 1fr 320px;
        gap: 0;
        height: 600px;
        margin: -1.5rem; /* Offset the base-dialog padding */
        transition: grid-template-columns 0.3s ease;
      }

      .dialog-content.adding-image {
        grid-template-columns: 280px 1fr;
      }

      .search-box {
        padding: 0 1rem 1rem;
        background: #fcfcfc;
        border-bottom: 1px solid var(--border-colour);
      }

      .search-box input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s;
      }

      .search-box input:focus {
        border-color: var(--primary-colour);
      }

      /* Image Grid Styles */
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        padding: 0.5rem;
      }

      .image-card {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        border: 1px solid var(--border-colour);
        transition: all 0.2s;
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }

      .image-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-small);
        border-color: var(--primary-colour);
      }

      .thumbnail-container {
        aspect-ratio: 4 / 3;
        background-color: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        border-bottom: 1px solid var(--border-colour);
      }

      .thumbnail-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .image-info {
        padding: 0.5rem;
      }

      .grid-image-name {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-colour);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }

      .grid-image-meta {
        font-size: 10px;
        color: var(--text-muted);
        margin-top: 2px;
      }

      /* Column common styles */
      .column {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-right: 1px solid var(--border-colour);
      }

      .column:last-child {
        border-right: none;
      }

      .column-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fcfcfc;
      }

      .column-title {
        font-weight: 800;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-muted);
      }

      .column-body {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .column-footer {
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--border-colour);
        display: flex;
        justify-content: flex-end;
        background: #fcfcfc;
      }

      /* Left Column: Image List */
      .image-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .image-item {
        padding: 8px 10px;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.2s;
        background: #fff;
      }

      .image-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
      }

      .image-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 4px rgba(3, 169, 244, 0.1);
      }

      .image-thumbnail {
        width: 40px;
        height: 30px;
        background: #f0f2f5;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1px solid #eee;
        flex-shrink: 0;
      }

      .image-thumbnail .material-icons {
        font-size: 18px;
        color: #bbb;
      }

      .image-name {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-colour);
      }

      /* Middle Column: Preview */
      .preview-container {
        background: #f0f2f5;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        min-width: 0;
      }

      .preview-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #bbb;
      }

      .preview-placeholder .material-icons {
        font-size: 64px;
        opacity: 0.3;
      }

      /* Right Column: Controls */
      .controls-group {
        margin-bottom: 2rem;
      }

      .controls-group-title {
        font-weight: 700;
        font-size: 13px;
        color: var(--text-colour);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .controls-group-title .material-icons {
        font-size: 18px;
        color: var(--primary-colour);
      }

      .control-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .control-row label {
        width: 80px;
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
        flex-shrink: 0;
      }

      .offset-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      .narrow-input {
        width: 80px !important;
        flex: none !important;
      }

      .scaling-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .scaling-icons {
        display: flex;
        gap: 4px;
      }

      .input-with-unit {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
      }

      .input-with-unit input {
        width: 100%;
        padding-right: 2rem;
      }

      .unit-label {
        position: absolute;
        right: 0.75rem;
        font-size: 11px;
        color: #aaa;
        font-weight: 600;
      }

      .dpad {
        display: grid;
        grid-template-columns: repeat(3, 40px);
        grid-template-rows: repeat(3, 40px);
        gap: 4px;
        justify-content: center;
        margin: 1.5rem 0;
      }

      .dpad-btn {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }

      .dpad-btn:hover {
        background: var(--bg-light);
        border-color: var(--primary-colour);
        color: var(--primary-colour);
      }

      .dpad-btn.up { grid-column: 2; grid-row: 1; }
      .dpad-btn.left { grid-column: 1; grid-row: 2; }
      .dpad-btn.reset { grid-column: 2; grid-row: 2; }
      .dpad-btn.right { grid-column: 3; grid-row: 2; }
      .dpad-btn.down { grid-column: 2; grid-row: 3; }

      .dpad-btn.reset .material-icons {
        font-size: 18px;
      }

      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      .icon-button {
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text-muted);
      }

      .icon-button:hover {
        background: #f0f2f5;
        color: var(--primary-colour);
      }

      .icon-button.danger:hover {
        background: #fff5f5;
        color: var(--danger-colour);
      }

      .color-selector {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }

      .color-swatch {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        padding: 0;
        box-sizing: border-box;
      }

      .color-swatch:hover {
        transform: scale(1.1);
        border-color: var(--primary-colour);
      }

      .color-swatch.selected {
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2);
      }

      .custom-color-input {
        width: 24px;
        height: 24px;
        padding: 0;
        border: 2px solid #ddd;
        border-radius: 50%;
        cursor: pointer;
        overflow: hidden;
        background: transparent;
      }

      .custom-color-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .custom-color-input::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
      }
    `
  ];

  public controller = new SceneItemSettingsController(this);

  async show(item: any, layout: Layout, displayTypes: DisplayType[]) {
    await this.controller.show(item, layout, displayTypes);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  protected updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    
    const propertiesToTriggerUpdate = [
      'controller.selectedImageId', 'controller.scalingFactor', 'controller.offsetX', 
      'controller.offsetY', 'controller.backgroundColor'
    ];

    if ([...changedProperties.keys()].some(p => propertiesToTriggerUpdate.includes(p))) {
      this.controller.triggerUpdate();
    }
  }

  private _getImageName(imageId: string) {
    const img = this.controller.availableImages.find(i => i.id === imageId);
    return img ? img.name : imageId;
  }


  render() {
    return html`
      <base-dialog title="Item Settings">
        <div class="dialog-content ${this.controller.isAddingImage ? 'adding-image' : ''}">
          <!-- Left Column: Images -->
          <div class="column">
            <div class="column-header">
              <div class="column-title">Images</div>
              <button class="icon-button" title="Add Image" @click="${() => this.controller.toggleAddImage()}">
                <span class="material-icons">${this.controller.isAddingImage ? 'close' : 'add'}</span>
              </button>
            </div>
            <div class="column-body">
              <div class="image-list">
                ${(this.controller.item?.images || []).map((img: any) => html`
                  <div 
                    class="image-item ${this.controller.selectedImageId === img.image_id ? 'selected' : ''}"
                    @click="${() => {
                      this.controller.selectedImageId = img.image_id;
                      this.controller.scalingFactor = img.scaling_factor;
                      this.controller.offsetX = img.offset.x;
                      this.controller.offsetY = img.offset.y;
                      this.controller.backgroundColor = img.background_color || '#ffffff';
                      this.requestUpdate();
                    }}"
                  >
                    <div class="image-thumbnail">
                      <img src="/api/image/${img.image_id}/thumbnail" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="image-name">${this._getImageName(img.image_id)}</div>
                  </div>
                `)}
                ${(!this.controller.item?.images || this.controller.item.images.length === 0) ? html`
                  <div style="text-align: center; color: #ccc; padding: 2rem 0; font-size: 12px;">
                    No images added to this item yet.
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="column-footer">
              <button 
                class="icon-button danger" 
                title="Delete Image"
                ?disabled="${!this.controller.selectedImageId}"
                @click="${() => {
                  this.controller.item.images = this.controller.item.images.filter((img: any) => img.image_id !== this.controller.selectedImageId);
                  this.controller.selectedImageId = this.controller.item.images.length > 0 ? this.controller.item.images[0].image_id : null;
                  this.requestUpdate();
                }}"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>

          ${this.controller.isAddingImage ? html`
            <!-- Center + Right replacement: Image Library Grid -->
            <div class="column">
              <div class="column-header">
                <div class="column-title">Image Library</div>
              </div>
              <div class="search-box">
                <input 
                  type="text" 
                  placeholder="Search images..." 
                  .value="${this.controller.searchQuery}"
                  @input="${(e: any) => { this.controller.searchQuery = e.target.value; this.requestUpdate(); }}"
                >
              </div>
              <div class="column-body">
                <div class="image-grid">
                  ${this.controller.availableImages
                    .filter(img => !this.controller.searchQuery || 
                           img.name.toLowerCase().includes(this.controller.searchQuery.toLowerCase()) ||
                           img.artist?.toLowerCase().includes(this.controller.searchQuery.toLowerCase()) ||
                           img.collection?.toLowerCase().includes(this.controller.searchQuery.toLowerCase()))
                    .map(image => html`
                      <div class="image-card" data-image-id="${image.id}" @click="${() => this.controller.selectImage(image)}">
                        <div class="thumbnail-container">
                          <img src="/api/image/${image.id}/thumbnail" alt="${image.name}" loading="lazy">
                        </div>
                        <div class="image-info">
                          <p class="grid-image-name" title="${image.name}">${image.name}</p>
                          <div class="grid-image-meta">
                            ${image.dimensions.width} &times; ${image.dimensions.height}
                          </div>
                        </div>
                      </div>
                    `)}
                </div>
              </div>
            </div>
          ` : html`
            <!-- Middle Column: Preview -->
            <div class="column">
              <div class="column-body" style="padding: 0;">
                <div class="preview-container">
                  ${this.controller.layout ? html`
                    <layout-editor
                      .width_mm="${this.controller.previewData.width}"
                      .height_mm="${this.controller.previewData.height}"
                      .items="${this.controller.previewData.items}"
                      .displayTypes="${this.controller.displayTypes}"
                      .readOnly="${true}"
                      .noPadding="${true}"
                      .hideNumber="${true}"
                      .previewImage="${this.controller.previewCanvas}"
                      .previewTotalSize="${{ width: this.controller.previewData.width, height: this.controller.previewData.height }}"
                    ></layout-editor>
                  ` : html`
                    <div class="preview-placeholder">
                      <span class="material-icons">monochrome_photos</span>
                      <span>Preview will appear here</span>
                    </div>
                  `}
                </div>
              </div>
            </div>

            <!-- Right Column: Mapping -->
            <div class="column">
              <div class="column-body">
                <!-- Scaling -->
                <div class="controls-group">
                  <div class="controls-group-title">
                    <div class="scaling-header">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons">aspect_ratio</span>
                        Scaling Factor
                      </div>
                      <div class="scaling-icons">
                        <button class="icon-button" title="Fit to Panel" @click="${() => { this.controller.fitImage(); this.requestUpdate(); }}">
                          <span class="material-icons">fit_screen</span>
                        </button>
                        <button class="icon-button" title="Fill Panel" @click="${() => { this.controller.fillImage(); this.requestUpdate(); }}">
                          <span class="material-icons">filter_center_focus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="control-row">
                    <input 
                      type="range" 
                      min="1" 
                      max="500" 
                      step="0.1"
                      .value="${this.controller.scalingFactor.toString()}"
                      @input="${(e: any) => {
                        this.controller.scalingFactor = parseFloat(e.target.value);
                        if (this.controller.selectedImageId) {
                          const img = this.controller.item.images.find((i: any) => i.image_id === this.controller.selectedImageId);
                          if (img) img.scaling_factor = this.controller.scalingFactor;
                        }
                        this.requestUpdate();
                      }}"
                      style="flex: 1;"
                    >
                    <div class="input-with-unit narrow-input">
                      <input 
                        type="number" 
                        step="0.1"
                        .value="${this.controller.scalingFactor.toString()}"
                        @input="${(e: any) => {
                          this.controller.scalingFactor = parseFloat(e.target.value);
                          if (this.controller.selectedImageId) {
                            const img = this.controller.item.images.find((i: any) => i.image_id === this.controller.selectedImageId);
                            if (img) img.scaling_factor = this.controller.scalingFactor;
                          }
                          this.requestUpdate();
                        }}"
                      >
                      <span class="unit-label">%</span>
                    </div>
                  </div>
                </div>

                <!-- Offset -->
                <div class="controls-group">
                  <div class="controls-group-title">
                    <span class="material-icons">open_with</span>
                    Offset
                  </div>
                  <div class="offset-grid">
                    <div>
                      <div class="control-row">
                        <label style="width: 60px;">X Offset</label>
                        <div class="input-with-unit narrow-input">
                          <input 
                            type="number" 
                            .value="${this.controller.offsetX.toString()}"
                            @input="${(e: any) => {
                              this.controller.offsetX = parseInt(e.target.value);
                              if (this.controller.selectedImageId) {
                                const img = this.controller.item.images.find((i: any) => i.image_id === this.controller.selectedImageId);
                                if (img) img.offset.x = this.controller.offsetX;
                              }
                              this.requestUpdate();
                            }}"
                          >
                          <span class="unit-label">px</span>
                        </div>
                      </div>
                      <div class="control-row" style="margin-bottom: 0;">
                        <label style="width: 60px;">Y Offset</label>
                        <div class="input-with-unit narrow-input">
                          <input 
                            type="number" 
                            .value="${this.controller.offsetY.toString()}"
                            @input="${(e: any) => {
                              this.controller.offsetY = parseInt(e.target.value);
                              if (this.controller.selectedImageId) {
                                const img = this.controller.item.images.find((i: any) => i.image_id === this.controller.selectedImageId);
                                if (img) img.offset.y = this.controller.offsetY;
                              }
                              this.requestUpdate();
                            }}"
                          >
                          <span class="unit-label">px</span>
                        </div>
                      </div>
                    </div>
                    <!-- D-Pad -->
                    <div class="dpad" style="margin: 0;">
                      <button class="dpad-btn up" title="Move Up" @click="${() => this.controller.moveImage(0, -10)}"><span class="material-icons">keyboard_arrow_up</span></button>
                      <button class="dpad-btn left" title="Move Left" @click="${() => this.controller.moveImage(-10, 0)}"><span class="material-icons">keyboard_arrow_left</span></button>
                      <button class="dpad-btn reset" title="Reset Offset" @click="${() => this.controller.moveImage(0, 0, true)}"><span class="material-icons">restart_alt</span></button>
                      <button class="dpad-btn right" title="Move Right" @click="${() => this.controller.moveImage(10, 0)}"><span class="material-icons">keyboard_arrow_right</span></button>
                      <button class="dpad-btn down" title="Move Down" @click="${() => this.controller.moveImage(0, 10)}"><span class="material-icons">keyboard_arrow_down</span></button>
                    </div>
                  </div>
                </div>

                <!-- Background Color -->
                <div class="controls-group">
                  <div class="controls-group-title">
                    <span class="material-icons">palette</span>
                    Background Colour
                  </div>
                  <div class="color-selector">
                    <button 
                      class="color-swatch ${this.controller.backgroundColor.toLowerCase() === '#ffffff' ? 'selected' : ''}" 
                      style="background: #ffffff;"
                      title="White"
                      @click="${() => this.controller.updateBackgroundColor('#ffffff')}"
                    ></button>
                    <button 
                      class="color-swatch ${this.controller.backgroundColor.toLowerCase() === '#000000' ? 'selected' : ''}" 
                      style="background: #000000;"
                      title="Black"
                      @click="${() => this.controller.updateBackgroundColor('#000000')}"
                    ></button>
                    <input 
                      type="color" 
                      class="custom-color-input" 
                      .value="${this.controller.backgroundColor}"
                      @input="${(e: any) => this.controller.updateBackgroundColor(e.target.value)}"
                      title="Custom Colour"
                    >
                  </div>
                </div>
              </div>
              <div class="column-footer">
                <button class="secondary" @click="${() => { 
                  this.controller.offsetX = 0; 
                  this.controller.offsetY = 0; 
                  if (this.controller.selectedImageId) {
                    const img = this.controller.item.images.find((i: any) => i.image_id === this.controller.selectedImageId);
                    if (img) img.offset = { x: 0, y: 0 };
                  }
                  this.requestUpdate();
                }}">Reset Mapping</button>
              </div>
            </div>
          `}
        </div>

        <div slot="footer" class="footer-actions" style="display: flex; width: 100%;">
          <button class="danger" style="margin-right: auto;" @click="${() => {
            this.dispatchEvent(new CustomEvent('delete', { bubbles: true, composed: true }));
            (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
          }}">Delete Item</button>
          <button class="secondary" @click="${() => (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close()}">Cancel</button>
          <button class="primary" @click="${() => {
            this.dispatchEvent(new CustomEvent('save-item', { detail: { item: this.controller.item }, bubbles: true, composed: true }));
            (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
          }}">Save Changes</button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scene-item-settings-dialog': SceneItemSettingsDialog;
  }
}
