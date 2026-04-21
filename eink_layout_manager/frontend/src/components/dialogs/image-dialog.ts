import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../shared/base-dialog';
import '../shared/keyword-input';
import { BaseDialog } from '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { api, Image } from '../../services/HaApiClient';

/**
 * A dialog component for adding and processing new images.
 * Currently updated with visual UI for metadata and upload.
 */
@customElement('image-dialog')
export class ImageDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        --dialog-width: 960px;
      }

      .dialog-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 0.5rem 0;
        width: 100%;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .metadata-fields {
        display: flex;
        flex-direction: column;
      }

      .upload-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--border-colour);
        border-radius: var(--border-radius);
        background: var(--bg-light);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        padding: 2rem;
        text-align: center;
      }

      .upload-section:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
        transform: translateY(-2px);
      }

      .upload-section .material-icons {
        font-size: 64px;
        color: #ccd0d4;
        margin-bottom: 1.5rem;
        transition: color 0.2s;
      }

      .upload-section:hover .material-icons {
        color: var(--primary-colour);
      }

      .upload-section p {
        margin: 0;
        color: var(--text-colour);
        font-weight: 500;
        font-size: 15px;
      }

      .upload-section .hint {
        font-weight: normal;
        font-size: 13px;
        margin-top: 0.5rem;
        color: var(--text-muted);
      }

      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
        transition: border-color 0.2s;
      }

      textarea:focus {
        outline: none;
        border-color: var(--primary-colour);
      }

      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: var(--border-radius);
      }

      .media-section {
        display: flex;
        flex-direction: column;
      }

      .error-message {
        background: #fff1f0;
        border: 1px solid #ffa39e;
        color: #f5222d;
        padding: 0.75rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.25rem;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Accordion Styles */
      .accordion-item {
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        background: white;
      }

      .accordion-item:not(:last-child) {
        border-bottom: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      .accordion-item:not(:first-of-type) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      .accordion-header {
        display: flex;
        padding: 0.75rem 1rem;
        background: var(--bg-light);
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        transition: background-color 0.2s;
      }

      .accordion-header:hover {
        background: #f0f2f5;
      }

      .accordion-header h3 {
        margin: 0;
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .accordion-icon {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--text-muted);
        font-size: 20px;
      }

      .accordion-item.open .accordion-icon {
        transform: rotate(180deg);
      }

      .accordion-content-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .accordion-item.open .accordion-content-wrapper {
        grid-template-rows: 1fr;
      }

      .accordion-content {
        overflow: hidden;
      }

      .accordion-content-inner {
        padding: 1.25rem 1rem;
        border-top: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .slider-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .slider-row input[type="range"] {
        flex: 1;
      }

      .slider-row input[type="number"] {
        width: 65px;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        color: var(--text-colour);
        margin-top: 0.25rem;
      }

      .checkbox-row input {
        width: auto;
        margin: 0;
      }

      select {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        font-size: 14px;
        font-family: inherit;
        background: white;
        transition: border-color 0.2s;
      }

      select:focus {
        outline: none;
        border-color: var(--primary-colour);
      }
    `
  ];

  @state() private _uploadedImage: Image | null = null;
  @state() private _editingImage: Image | null = null;
  @state() private _isUploading = false;
  @state() private _error: string | null = null;
  @state() private _keywords: string[] = [];
  @state() private _imageName: string = '';
  @state() private _artist: string = '';
  @state() private _collection: string = '';
  @state() private _description: string = '';
  @state() private _brightness: number = 1.0;
  @state() private _contrast: number = 1.0;
  @state() private _saturation: number = 1.0;
  @state() private _ditheringType: string = 'errorDiffusion';
  @state() private _errorDiffusionMatrix: string = 'floydSteinberg';
  @state() private _serpentine: boolean = false;
  @state() private _palette: string = 'default';
  @state() private _sampleColoursFromImage: boolean = false;
  @state() private _numberOfSampleColours: number = 10;
  @state() private _detailsOpen = true;
  @state() private _propertiesOpen = false;

  async show(image?: Image) {
    this._editingImage = image || null;
    this._uploadedImage = image || null;
    this._isUploading = false;
    this._error = null;
    this._keywords = image?.keywords || [];
    this._imageName = image?.name || '';
    this._artist = image?.artist || '';
    this._collection = image?.collection || '';
    this._description = image?.description || '';
    this._brightness = image?.brightness ?? 1.0;
    this._contrast = image?.contrast ?? 1.0;
    this._saturation = image?.saturation ?? 1.0;
    this._ditheringType = image?.conversion?.ditheringType || 'errorDiffusion';
    this._errorDiffusionMatrix = image?.conversion?.errorDiffusionMatrix || 'floydSteinberg';
    this._serpentine = image?.conversion?.serpentine ?? false;
    this._palette = (Array.isArray(image?.conversion?.palette) ? image?.conversion?.palette.join(', ') : image?.conversion?.palette) || 'default';
    this._sampleColoursFromImage = image?.conversion?.sampleColoursFromImage ?? false;
    this._numberOfSampleColours = image?.conversion?.numberOfSampleColours ?? 10;
    this._detailsOpen = true;
    this._propertiesOpen = false;
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _toggleSection(section: 'details' | 'properties') {
    if (section === 'details') {
      this._detailsOpen = !this._detailsOpen;
      this._propertiesOpen = !this._detailsOpen;
    } else {
      this._propertiesOpen = !this._propertiesOpen;
      this._detailsOpen = !this._propertiesOpen;
    }
  }

  private _handleUploadClick() {
    this.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  }

  private async _onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      await this._processFile(input.files[0]);
    }
  }

  private _onDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    this.shadowRoot?.querySelector('.upload-section')?.classList.add('drag-over');
  }

  private _onDragLeave() {
    this.shadowRoot?.querySelector('.upload-section')?.classList.remove('drag-over');
  }

  private async _onDrop(e: DragEvent) {
    e.preventDefault();
    this._onDragLeave();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      await this._processFile(file);
    }
  }

  private async _handleCancel() {
    // Only delete the image if it was a new upload that hasn't been saved yet.
    // If we are editing an existing image, we should NOT delete it.
    if (!this._editingImage && this._uploadedImage) {
      try {
        await api.deleteItem('image', this._uploadedImage.id);
      } catch (err) {
        console.error('Failed to cleanup uploaded image:', err);
      }
    }
    this._uploadedImage = null;
    this._editingImage = null;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private async _processFile(file: File) {
    this._isUploading = true;
    this._error = null;
    try {
      const result = await api.uploadImage(file);
      this._uploadedImage = result;
      this._imageName = result.name;
    } catch (err: any) {
      this._error = err.message || 'Failed to upload image';
      console.error('Upload error:', err);
    } finally {
      this._isUploading = false;
    }
  }

  private _handleKeywordsChanged(e: CustomEvent<{ keywords: string[] }>) {
    this._keywords = e.detail.keywords;
  }

  private async _handleSave() {
    if (!this._uploadedImage || !this._imageName.trim()) return;

    this._isUploading = true;
    this._error = null;
    try {
      const metadata = {
        name: this._imageName,
        artist: this._artist,
        collection: this._collection,
        description: this._description,
        keywords: this._keywords,
        brightness: this._brightness,
        contrast: this._contrast,
        saturation: this._saturation,
        conversion: {
          ditheringType: this._ditheringType as any,
          errorDiffusionMatrix: this._errorDiffusionMatrix as any,
          serpentine: this._serpentine,
          palette: this._palette,
          sampleColoursFromImage: this._sampleColoursFromImage,
          numberOfSampleColours: this._numberOfSampleColours
        }
      };

      if (this._editingImage) {
        await api.updateImage(this._editingImage.id, { ...this._editingImage, ...metadata });
      } else {
        await api.updateImage(this._uploadedImage.id, { ...this._uploadedImage, ...metadata });
      }

      this.dispatchEvent(new CustomEvent('image-saved', {
        bubbles: true,
        composed: true
      }));
      
      this._uploadedImage = null;
      this._editingImage = null;
      (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
    } catch (err: any) {
      this._error = err.message || 'Failed to save image metadata';
      console.error('Save error:', err);
    } finally {
      this._isUploading = false;
    }
  }

  render() {
    return html`
      <base-dialog title="${this._editingImage ? 'Edit Image' : 'Add New Image'}">
        <div class="dialog-content">
          <!-- Metadata Fields (Left) -->
          <div class="metadata-fields">
            ${this._error ? html`
              <div class="error-message">
                <span class="material-icons" style="font-size: 18px;">error_outline</span>
                ${this._error}
              </div>
            ` : ''}

            <!-- Details Section -->
            <div class="accordion-item ${this._detailsOpen ? 'open' : ''}">
              <div class="accordion-header" @click="${() => this._toggleSection('details')}">
                <h3>Details</h3>
                <span class="material-icons accordion-icon">expand_more</span>
              </div>
              <div class="accordion-content-wrapper">
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Name</label>
                      <input 
                        type="text" 
                        placeholder="Optional - defaults to filename"
                        .value="${this._imageName}"
                        @input="${(e: InputEvent) => this._imageName = (e.target as HTMLInputElement).value}"
                      >
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Artist</label>
                      <input 
                        type="text" 
                        placeholder="Who created this?"
                        .value="${this._artist}"
                        @input="${(e: InputEvent) => this._artist = (e.target as HTMLInputElement).value}"
                      >
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Collection</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Landscapes, Personal"
                        .value="${this._collection}"
                        @input="${(e: InputEvent) => this._collection = (e.target as HTMLInputElement).value}"
                      >
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Keywords</label>
                      <keyword-input 
                        .keywords="${this._keywords}"
                        @keywords-changed="${this._handleKeywordsChanged}"
                      ></keyword-input>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Description</label>
                      <textarea 
                        placeholder="Describe the image..."
                        .value="${this._description}"
                        @input="${(e: InputEvent) => this._description = (e.target as HTMLTextAreaElement).value}"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item ${this._propertiesOpen ? 'open' : ''}">
              <div class="accordion-header" @click="${() => this._toggleSection('properties')}">
                <h3>Image Properties</h3>
                <span class="material-icons accordion-icon">expand_more</span>
              </div>
              <div class="accordion-content-wrapper">
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    <!-- Brightness -->
                    <div class="control-group">
                      <label>Brightness</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._brightness.toString()}"
                          @input="${(e: InputEvent) => this._brightness = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._brightness.toString()}"
                          @input="${(e: InputEvent) => this._brightness = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                      </div>
                    </div>

                    <!-- Contrast -->
                    <div class="control-group">
                      <label>Contrast</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._contrast.toString()}"
                          @input="${(e: InputEvent) => this._contrast = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._contrast.toString()}"
                          @input="${(e: InputEvent) => this._contrast = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                      </div>
                    </div>

                    <!-- Saturation -->
                    <div class="control-group">
                      <label>Saturation</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._saturation.toString()}"
                          @input="${(e: InputEvent) => this._saturation = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._saturation.toString()}"
                          @input="${(e: InputEvent) => this._saturation = parseFloat((e.target as HTMLInputElement).value)}"
                        >
                      </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid var(--border-colour); margin: 0.5rem 0;">

                    <!-- Dithering Type -->
                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Dithering Type</label>
                      <select 
                        .value="${this._ditheringType}"
                        @change="${(e: Event) => this._ditheringType = (e.target as HTMLSelectElement).value}"
                      >
                        <option value="errorDiffusion">Error Diffusion</option>
                        <option value="ordered">Ordered</option>
                        <option value="random">Random</option>
                        <option value="quantizationOnly">Quantization Only</option>
                      </select>
                    </div>

                    ${this._ditheringType === 'errorDiffusion' ? html`
                      <div class="form-group" style="margin-bottom: 0;">
                        <label>Error Diffusion Matrix</label>
                        <select 
                          .value="${this._errorDiffusionMatrix}"
                          @change="${(e: Event) => this._errorDiffusionMatrix = (e.target as HTMLSelectElement).value}"
                        >
                          <option value="floydSteinberg">Floyd-Steinberg</option>
                          <option value="falseFloydSteinberg">False Floyd-Steinberg</option>
                          <option value="jarvis">Jarvis</option>
                          <option value="stucki">Stucki</option>
                          <option value="burkes">Burkes</option>
                          <option value="sierra3">Sierra 3</option>
                          <option value="sierra2">Sierra 2</option>
                          <option value="sierra2-4a">Sierra 2-4a</option>
                        </select>
                      </div>
                      <label class="checkbox-row">
                        <input 
                          type="checkbox"
                          ?checked="${this._serpentine}"
                          @change="${(e: Event) => this._serpentine = (e.target as HTMLInputElement).checked}"
                        >
                        Serpentine Dithering
                      </label>
                    ` : ''}

                    <!-- Palette -->
                    <div class="form-group" style="margin-bottom: 0;">
                      <label>Palette</label>
                      <input 
                        type="text" 
                        placeholder="e.g. default, or #000000, #ffffff"
                        .value="${this._palette}"
                        @input="${(e: InputEvent) => this._palette = (e.target as HTMLInputElement).value}"
                      >
                    </div>

                    <!-- Color Sampling -->
                    <label class="checkbox-row">
                      <input 
                        type="checkbox"
                        ?checked="${this._sampleColoursFromImage}"
                        @change="${(e: Event) => this._sampleColoursFromImage = (e.target as HTMLInputElement).checked}"
                      >
                      Sample colours from image
                    </label>

                    ${this._sampleColoursFromImage ? html`
                      <div class="form-group" style="margin-bottom: 0;">
                        <label>Number of Colours to Sample</label>
                        <input 
                          type="number" min="1" max="256"
                          .value="${this._numberOfSampleColours.toString()}"
                          @input="${(e: InputEvent) => this._numberOfSampleColours = parseInt((e.target as HTMLInputElement).value)}"
                        >
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Media & Technical Info (Right) -->
          <div class="media-section">
            <div 
              class="upload-section"
              style="${this._editingImage ? 'cursor: default; border-style: solid; opacity: 0.9;' : ''}"
              @click="${this._editingImage ? null : this._handleUploadClick}"
              @dragover="${this._editingImage ? (e: Event) => e.preventDefault() : this._onDragOver}"
              @dragleave="${this._editingImage ? null : this._onDragLeave}"
              @drop="${this._editingImage ? (e: Event) => e.preventDefault() : this._onDrop}"
            >
              ${this._uploadedImage ? html`
                <img 
                  src="api/image/${this._uploadedImage.id}/thumbnail" 
                  class="preview-image"
                  alt="Thumbnail preview"
                >
              ` : html`
                <span class="material-icons">
                  ${this._isUploading ? 'sync' : 'cloud_upload'}
                </span>
                <p>${this._isUploading ? 'Uploading...' : 'Drag & Drop Image'}</p>
                <p class="hint">${this._isUploading ? 'This may take a moment' : 'or click to browse your files'}</p>
              `}
              ${this._editingImage ? '' : html`
                <input 
                  type="file" 
                  style="display: none;" 
                  accept="image/*"
                  @change="${this._onFileChange}"
                >
              `}
            </div>

            <div class="grid" style="margin-top: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Dimensions</label>
                <input 
                  type="text" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage ? `${this._uploadedImage.dimensions.width} × ${this._uploadedImage.dimensions.height} px` : ''}"
                >
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Format</label>
                <input 
                  type="text" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?.file_type || ''}"
                >
              </div>
            </div>

            <div class="form-group" style="margin-top: 1rem; margin-bottom: 0;">
              <label>Colour Depth</label>
              <input 
                type="text" 
                readonly 
                placeholder="Auto-detected"
                .value="${this._uploadedImage?.colour_depth || ''}"
              >
            </div>
          </div>
        </div>

        <div slot="footer" class="footer-actions">
          <button 
            class="secondary" 
            @click="${this._handleCancel}"
          >
            Cancel
          </button>
          <button 
            ?disabled="${this._isUploading || !this._uploadedImage || !this._imageName.trim()}"
            @click="${this._handleSave}"
          >
            <span class="material-icons">save</span>
            ${this._editingImage ? 'Update Image' : 'Save Image'}
          </button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-dialog': ImageDialog;
  }
}
