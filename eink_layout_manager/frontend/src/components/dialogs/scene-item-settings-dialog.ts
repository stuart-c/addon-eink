import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { Layout, DisplayType, Image as ImageMetadata, api } from '../../services/HaApiClient';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import '../layout/layout-editor';
import { 
  ditherImage, 
  getDefaultPalettes 
} from '../../lib/epdoptimize/index';

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
        border-right: 1px solid var(--border-colour);
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
    `
  ];

  @property({ type: Object }) item: any = null;
  @state() private _selectedImageId: string | null = null;
  @state() private _scalingFactor = 100;
  @state() private _offsetX = 0;
  @state() private _offsetY = 0;
  @state() private _layout: Layout | null = null;
  @state() private _displayTypes: DisplayType[] = [];
  @state() private _isAddingImage = false;
  @state() private _availableImages: ImageMetadata[] = [];
  @state() private _searchQuery = '';
  @state() private _previewCanvas: HTMLCanvasElement | null = null;
  private _updateTimer: any = null;

  async show(item: any, layout: Layout, displayTypes: DisplayType[]) {
    this.item = item;
    this._layout = layout;
    this._displayTypes = displayTypes;
    this._isAddingImage = false;

    // Fetch images if not already loaded to get names for the sidebar
    if (this._availableImages.length === 0) {
      try {
        this._availableImages = await api.getImages();
      } catch (e) {
        console.error('Failed to fetch images', e);
      }
    }

    // Set initial values from item if available
    if (item.images && item.images.length > 0) {
      this._selectedImageId = item.images[0].image_id;
      this._scalingFactor = item.images[0].scaling_factor || 100;
      this._offsetX = item.images[0].offset?.x || 0;
      this._offsetY = item.images[0].offset?.y || 0;
    } else {
      this._selectedImageId = null;
    }
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
    this._triggerUpdate();
  }

  private _triggerUpdate() {
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }
    this._updateTimer = setTimeout(() => this._updatePreview(), 250);
  }

  private async _updatePreview() {
    if (!this._selectedImageId || !this.item || !this._previewData.width) {
      this._previewCanvas = null;
      return;
    }

    const image = this._availableImages.find(i => i.id === this._selectedImageId);
    if (!image) return;

    // Load source image
    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    imgElement.src = `/api/image/${image.id}/file`;
    await new Promise((resolve, reject) => {
      imgElement.onload = resolve;
      imgElement.onerror = reject;
    });

    // Reference display type for DPI
    const firstDisplayId = this.item.displays[0];
    const layoutBox = this._layout?.items.find(i => i.id === firstDisplayId);
    const dt = this._displayTypes.find(t => t.id === layoutBox?.display_type_id);
    if (!dt || !dt.width_mm || !dt.width_px) return;

    const pxPerMm = dt.width_px / dt.width_mm;
    const canvasWidthPx = Math.round(this._previewData.width * pxPerMm);
    const canvasHeightPx = Math.round(this._previewData.height * pxPerMm);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidthPx;
    tempCanvas.height = canvasHeightPx;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Draw background (white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidthPx, canvasHeightPx);

    // Apply adjustments if present in image metadata
    const brightness = image.brightness ?? 1.0;
    const contrast = image.contrast ?? 1.0;
    const saturation = image.saturation ?? 1.0;
    ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;

    // Calculate image dimensions with scaling
    const scaledWidth = (image.dimensions.width * this._scalingFactor) / 100;
    const scaledHeight = (image.dimensions.height * this._scalingFactor) / 100;

    // Account for relative offset between display areas and frame area
    const frameBB = this._previewData;
    const panelBB = this._panelBoundingBox;
    const relX = (panelBB.minX - frameBB.minX) * pxPerMm;
    const relY = (panelBB.minY - frameBB.minY) * pxPerMm;

    // Draw image with offset
    ctx.drawImage(
      imgElement, 
      relX + this._offsetX, 
      relY + this._offsetY, 
      scaledWidth, 
      scaledHeight
    );
    ctx.filter = 'none';

    // Dither
    const ditherCanvas = document.createElement('canvas');
    ditherCanvas.width = canvasWidthPx;
    ditherCanvas.height = canvasHeightPx;

    const palette = this._getPaletteForDisplays();
    const options = {
      ditheringType: image.conversion?.ditheringType || 'errorDiffusion',
      errorDiffusionMatrix: image.conversion?.errorDiffusionMatrix || 'floydSteinberg',
      serpentine: image.conversion?.serpentine ?? false,
      palette,
      processingPreset: image.conversion?.processingPreset || ''
    };

    try {
      await ditherImage(tempCanvas, ditherCanvas, options as any);
      this._previewCanvas = ditherCanvas;
    } catch (e) {
      console.error('Failed to dither preview', e);
      this._previewCanvas = tempCanvas; // Fallback to raw canvas
    }
  }

  private _getPaletteForDisplays(): string[] {
    const displayTypeIds = new Set(
      this._layout?.items
        .filter(i => this.item.displays.includes(i.id))
        .map(i => i.display_type_id)
    );

    const palettes: Set<string> = new Set();
    displayTypeIds.forEach(id => {
      const dt = this._displayTypes.find(t => t.id === id);
      if (dt) {
        if (dt.colour_type === 'BWGBRY') palettes.add('spectra6');
        else if (dt.colour_type === 'BWR') palettes.add('acep'); // fallback or BWR palette if exists
        else palettes.add('default');
      }
    });

    // For now, just take the first palette identified
    const paletteName = palettes.values().next().value || 'default';
    return getDefaultPalettes(paletteName);
  }

  private _getImageName(imageId: string) {
    const img = this._availableImages.find(i => i.id === imageId);
    return img ? img.name : imageId;
  }

  private async _toggleAddImage() {
    this._isAddingImage = !this._isAddingImage;
    if (this._isAddingImage && this._availableImages.length === 0) {
      try {
        this._availableImages = await api.getImages();
      } catch (e) {
        console.error('Failed to fetch images', e);
      }
    }
  }

  private _selectImage(image: ImageMetadata) {
    if (!this.item.images) {
      this.item.images = [];
    }
    
    // Check if image already exists
    if (this.item.images.find((img: any) => img.image_id === image.id)) {
      this._isAddingImage = false;
      this._selectedImageId = image.id;
      return;
    }

    const newImage = {
      image_id: image.id,
      scaling_factor: 100,
      offset: { x: 0, y: 0 }
    };
    
    this.item.images = [...this.item.images, newImage];
    this._selectedImageId = image.id;
    this._scalingFactor = 100;
    this._offsetX = 0;
    this._offsetY = 0;
    
    // Automatically fit new image
    this._fitImage();

    this._isAddingImage = false;
    this.requestUpdate();
  }

  protected updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('_selectedImageId') || 
      changedProperties.has('_scalingFactor') || 
      changedProperties.has('_offsetX') || 
      changedProperties.has('_offsetY')
    ) {
      this._triggerUpdate();
    }
  }

  private _moveImage(dx: number, dy: number, reset = false) {
    if (reset) {
      this._offsetX = 0;
      this._offsetY = 0;
    } else {
      this._offsetX += dx;
      this._offsetY += dy;
    }

    if (this._selectedImageId) {
      const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
      if (img) {
        img.offset.x = this._offsetX;
        img.offset.y = this._offsetY;
      }
    }
    this.requestUpdate();
  }

  private _handleOk() {
    this.dispatchEvent(new CustomEvent('save-item', {
      detail: { item: this.item },
      bubbles: true,
      composed: true
    }));
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleCancel() {
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleDeleteItem() {
    this.dispatchEvent(new CustomEvent('delete', {
      bubbles: true,
      composed: true
    }));
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private get _previewData() {
    if (!this._layout || !this.item || !this.item.displays || this.item.displays.length === 0) {
      return { width: 0, height: 0, items: [], minX: 0, minY: 0 };
    }

    const visibleItems = this._layout.items.filter(i => this.item.displays.includes(i.id));
    if (visibleItems.length === 0) {
      return { width: 0, height: 0, items: [], minX: 0, minY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const itemsWithDimensions = visibleItems.map(item => {
      const dt = this._displayTypes.find(t => t.id === item.display_type_id);
      if (!dt) return { item, w: 0, h: 0 };
      const isPortrait = item.orientation === 'portrait';
      const w = isPortrait ? dt.height_mm : dt.width_mm;
      const h = isPortrait ? dt.width_mm : dt.height_mm;
      
      minX = Math.min(minX, item.x_mm);
      minY = Math.min(minY, item.y_mm);
      maxX = Math.max(maxX, item.x_mm + w);
      maxY = Math.max(maxY, item.y_mm + h);
      
      return { item, w, h };
    });

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);

    const adjustedItems = itemsWithDimensions.map(({ item }) => ({
      ...item,
      x_mm: item.x_mm - minX,
      y_mm: item.y_mm - minY
    }));

    return { width, height, items: adjustedItems, minX, minY };
  }

  private get _panelBoundingBox() {
    if (!this._layout || !this.item || !this.item.displays || this.item.displays.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    const visibleItems = this._layout.items.filter(i => this.item.displays.includes(i.id));
    if (visibleItems.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    visibleItems.forEach(item => {
      const dt = this._displayTypes.find(t => t.id === item.display_type_id);
      if (!dt) return;

      const isPortrait = item.orientation === 'portrait';
      const frameW = isPortrait ? dt.height_mm : dt.width_mm;
      const frameH = isPortrait ? dt.width_mm : dt.height_mm;
      const panelW = isPortrait ? dt.panel_height_mm : dt.panel_width_mm;
      const panelH = isPortrait ? dt.panel_width_mm : dt.panel_height_mm;

      const panelX = item.x_mm + (frameW - panelW) / 2;
      const panelY = item.y_mm + (frameH - panelH) / 2;

      minX = Math.min(minX, panelX);
      minY = Math.min(minY, panelY);
      maxX = Math.max(maxX, panelX + panelW);
      maxY = Math.max(maxY, panelY + panelH);
    });

    return { 
      width: Math.max(0, maxX - minX), 
      height: Math.max(0, maxY - minY),
      minX, 
      minY 
    };
  }

  private _fitImage() {
    this._applyImageFitting('fit');
  }

  private _fillImage() {
    this._applyImageFitting('fill');
  }

  private _applyImageFitting(mode: 'fit' | 'fill') {
    if (!this._selectedImageId || !this.item || !this.item.displays || this.item.displays.length === 0) return;
    const image = this._availableImages.find(i => i.id === this._selectedImageId);
    if (!image) return;

    const panelBB = this._panelBoundingBox;
    const firstDisplayId = this.item.displays[0];
    const layoutBox = this._layout?.items.find(i => i.id === firstDisplayId);
    const dt = this._displayTypes.find(t => t.id === layoutBox?.display_type_id);
    if (!dt || !dt.width_mm || !dt.width_px) return;

    const pxPerMm = dt.width_px / dt.width_mm;
    const targetWidthPx = panelBB.width * pxPerMm;
    const targetHeightPx = panelBB.height * pxPerMm;

    const scaleW = targetWidthPx / image.dimensions.width;
    const scaleH = targetHeightPx / image.dimensions.height;
    
    if (mode === 'fit') {
      this._scalingFactor = Math.floor(Math.min(scaleW, scaleH) * 100);
    } else {
      this._scalingFactor = Math.ceil(Math.max(scaleW, scaleH) * 100);
    }

    const scaledWidth = (image.dimensions.width * this._scalingFactor) / 100;
    const scaledHeight = (image.dimensions.height * this._scalingFactor) / 100;

    this._offsetX = Math.round((targetWidthPx - scaledWidth) / 2);
    this._offsetY = Math.round((targetHeightPx - scaledHeight) / 2);

    // Update the item data
    const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
    if (img) {
      img.scaling_factor = this._scalingFactor;
      img.offset = { x: this._offsetX, y: this._offsetY };
    }
    this.requestUpdate();
  }

  render() {
    return html`
      <base-dialog title="Item Settings">
        <div class="dialog-content ${this._isAddingImage ? 'adding-image' : ''}">
          <!-- Left Column: Images -->
          <div class="column">
            <div class="column-header">
              <div class="column-title">Images</div>
              <button class="icon-button" title="Add Image" @click="${this._toggleAddImage}">
                <span class="material-icons">${this._isAddingImage ? 'close' : 'add'}</span>
              </button>
            </div>
            <div class="column-body">
              <div class="image-list">
                ${(this.item?.images || []).map((img: any) => html`
                  <div 
                    class="image-item ${this._selectedImageId === img.image_id ? 'selected' : ''}"
                    @click="${() => {
                      this._selectedImageId = img.image_id;
                      this._scalingFactor = img.scaling_factor;
                      this._offsetX = img.offset.x;
                      this._offsetY = img.offset.y;
                    }}"
                  >
                    <div class="image-thumbnail">
                      <img src="/api/image/${img.image_id}/thumbnail" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="image-name">${this._getImageName(img.image_id)}</div>
                  </div>
                `)}
                ${(!this.item?.images || this.item.images.length === 0) ? html`
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
                ?disabled="${!this._selectedImageId}"
                @click="${() => {
                  this.item.images = this.item.images.filter((img: any) => img.image_id !== this._selectedImageId);
                  this._selectedImageId = this.item.images.length > 0 ? this.item.images[0].image_id : null;
                  this.requestUpdate();
                }}"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>

          ${this._isAddingImage ? html`
            <!-- Center + Right replacement: Image Library Grid -->
            <div class="column">
              <div class="column-header">
                <div class="column-title">Image Library</div>
              </div>
              <div class="search-box">
                <input 
                  type="text" 
                  placeholder="Search images..." 
                  .value="${this._searchQuery}"
                  @input="${(e: any) => this._searchQuery = e.target.value}"
                >
              </div>
              <div class="column-body">
                <div class="image-grid">
                  ${this._availableImages
                    .filter(img => !this._searchQuery || 
                           img.name.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
                           img.artist?.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
                           img.collection?.toLowerCase().includes(this._searchQuery.toLowerCase()))
                    .map(image => html`
                      <div class="image-card" @click="${() => this._selectImage(image)}">
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
                  ${this._layout ? html`
                    <layout-editor
                      .width_mm="${this._previewData.width}"
                      .height_mm="${this._previewData.height}"
                      .items="${this._previewData.items}"
                      .displayTypes="${this._displayTypes}"
                      .readOnly="${true}"
                      .noPadding="${true}"
                      .previewImage="${this._previewCanvas}"
                      .previewTotalSize="${{ width: this._previewData.width, height: this._previewData.height }}"
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
                    <span class="material-icons">aspect_ratio</span>
                    Scaling Factor
                  </div>
                  <div class="control-row">
                    <input 
                      type="range" 
                      min="1" 
                      max="500" 
                      .value="${this._scalingFactor}"
                      @input="${(e: any) => {
                        this._scalingFactor = parseInt(e.target.value);
                        if (this._selectedImageId) {
                          const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
                          if (img) img.scaling_factor = this._scalingFactor;
                        }
                      }}"
                      style="flex: 1;"
                    >
                  </div>
                  <div class="control-row">
                    <div class="input-with-unit">
                      <input 
                        type="number" 
                        .value="${this._scalingFactor}"
                        @input="${(e: any) => {
                          this._scalingFactor = parseInt(e.target.value);
                          if (this._selectedImageId) {
                            const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
                            if (img) img.scaling_factor = this._scalingFactor;
                          }
                        }}"
                      >
                      <span class="unit-label">%</span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                      <button class="secondary" style="padding: 6px 12px; font-size: 11px; flex: 1;" @click="${this._fitImage}">FIT</button>
                      <button class="secondary" style="padding: 6px 12px; font-size: 11px; flex: 1;" @click="${this._fillImage}">FILL</button>
                    </div>
                  </div>
                </div>

                <!-- Offset -->
                <div class="controls-group">
                  <div class="controls-group-title">
                    <span class="material-icons">open_with</span>
                    Offset
                  </div>
                  <div class="control-row">
                    <label>X Offset</label>
                    <div class="input-with-unit">
                      <input 
                        type="number" 
                        .value="${this._offsetX}"
                        @input="${(e: any) => {
                          this._offsetX = parseInt(e.target.value);
                          if (this._selectedImageId) {
                            const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
                            if (img) img.offset.x = this._offsetX;
                          }
                        }}"
                      >
                      <span class="unit-label">px</span>
                    </div>
                  </div>
                  <div class="control-row">
                    <label>Y Offset</label>
                    <div class="input-with-unit">
                      <input 
                        type="number" 
                        .value="${this._offsetY}"
                        @input="${(e: any) => {
                          this._offsetY = parseInt(e.target.value);
                          if (this._selectedImageId) {
                            const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
                            if (img) img.offset.y = this._offsetY;
                          }
                        }}"
                      >
                      <span class="unit-label">px</span>
                    </div>
                  </div>

                  <!-- D-Pad -->
                  <div class="dpad">
                    <button class="dpad-btn up" title="Move Up" @click="${() => this._moveImage(0, -10)}"><span class="material-icons">keyboard_arrow_up</span></button>
                    <button class="dpad-btn left" title="Move Left" @click="${() => this._moveImage(-10, 0)}"><span class="material-icons">keyboard_arrow_left</span></button>
                    <button class="dpad-btn reset" title="Reset Offset" @click="${() => this._moveImage(0, 0, true)}"><span class="material-icons">restart_alt</span></button>
                    <button class="dpad-btn right" title="Move Right" @click="${() => this._moveImage(10, 0)}"><span class="material-icons">keyboard_arrow_right</span></button>
                    <button class="dpad-btn down" title="Move Down" @click="${() => this._moveImage(0, 10)}"><span class="material-icons">keyboard_arrow_down</span></button>
                  </div>
                </div>
              </div>
              <div class="column-footer">
                <button class="secondary" @click="${() => { 
                  this._offsetX = 0; 
                  this._offsetY = 0; 
                  if (this._selectedImageId) {
                    const img = this.item.images.find((i: any) => i.image_id === this._selectedImageId);
                    if (img) img.offset = { x: 0, y: 0 };
                  }
                  this.requestUpdate();
                }}">Reset Mapping</button>
              </div>
            </div>
          `}
        </div>

        <div slot="footer" class="footer-actions" style="display: flex; width: 100%;">
          <button class="danger" style="margin-right: auto;" @click="${this._handleDeleteItem}">Delete Item</button>
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" @click="${this._handleOk}">Save Changes</button>
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
