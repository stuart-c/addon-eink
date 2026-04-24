import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import '../shared/base-dialog';
import '../shared/keyword-input';
import { BaseDialog } from '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { api, Image } from '../../services/HaApiClient';
import { 
  ditherImage, 
  suggestCanvasProcessingOptions,
  getDefaultPalettes 
} from 'epdoptimize';

/**
 * A dialog component for adding and processing new images.
 * Currently updated with visual UI for metadata and upload.
 */
@customElement('image-dialog')
export class ImageDialog extends LitElement {
  @query('#preview-canvas') private _canvas!: HTMLCanvasElement;
  @query('#source-image') private _sourceImg!: HTMLImageElement;
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
        height: 65vh;
        overflow: hidden;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .metadata-fields {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding-right: 0.5rem;
      }

      .upload-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--bg-light);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        padding: 1.5rem;
        text-align: center;
        border-bottom: 1px solid var(--border-colour);
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
        width: 100%;
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
        overflow: hidden;
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

      .preview-details-card {
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        overflow: hidden;
        background: white;
        display: flex;
        flex-direction: column;
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

      .control-group.horizontal {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .control-group.horizontal label {
        margin-bottom: 0;
        flex: 0 0 180px;
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

<<<<<<< HEAD
      .checkbox-row.reversed {
        justify-content: space-between;
        width: 100%;
        margin-top: 0.5rem;
      }

      .checkbox-row.reversed span {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
=======
      .summary-table td .unit {
        font-size: 11px;
        color: var(--secondary-text-colour);
        margin-left: 2px;
      }

      .suggest-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 10px;
        margin-bottom: 1rem;
        background: var(--primary-colour);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .suggest-button:hover {
        background: var(--primary-colour-dark, #3b82f6);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }

      .suggest-button:active {
        transform: translateY(0);
      }

      .suggest-button .material-icons {
        font-size: 18px;
      }

      .checkbox-row input {
        width: auto;
        margin: 0;
      }

      .form-group.horizontal {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .form-group.horizontal label {
        margin-bottom: 0;
        flex: 0 0 180px;
      }

      .form-group.horizontal select {
        flex: 1;
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

      .preview-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: white;
        border-bottom: 1px solid var(--border-colour);
      }

      .preview-controls label {
        margin: 0;
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }

      .preview-controls select {
        flex: 1;
        max-width: 200px;
        padding: 6px 10px;
      }

      .summary-table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
        font-size: 12px;
      }

      .summary-table th, .summary-table td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
      }

      .summary-table th {
        background: var(--bg-light);
        color: var(--text-muted);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        width: 40%;
      }

      .summary-table tr:last-child td, .summary-table tr:last-child th {
        border-bottom: none;
      }

      .summary-table .val {
        font-weight: 600;
        color: var(--text-colour);
      }

      .summary-table .unit {
        color: #aaa;
        margin-left: 2px;
        font-weight: normal;
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
  @state() private _palette: string = 'aitjcizeSpectra6Palette';
  @state() private _processingPreset: '' | 'balanced' | 'dynamic' | 'vivid' | 'soft' | 'greyscale' = '';


  @state() private _detailsOpen = true;
  @state() private _propertiesOpen = false;
  private _updateTimer: any = null;

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
    this._palette = 'aitjcizeSpectra6Palette';
    this._processingPreset = (image?.conversion?.processingPreset as any) || '';

    this._detailsOpen = true;
    this._propertiesOpen = false;
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
    this._triggerUpdate();
  }

  private _toggleSection(section: 'details' | 'properties') {
    if (section === 'details') {
      this._detailsOpen = !this._detailsOpen;
      this._propertiesOpen = !this._detailsOpen;
    } else {
      this._propertiesOpen = !this._propertiesOpen;
      this._detailsOpen = !this._propertiesOpen;
    }
    
    // Trigger update after animation finished or properties opened
    if (this._propertiesOpen) {
      setTimeout(() => this._triggerUpdate(), 300);
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

  private _handleDelete() {
    if (!this._editingImage) return;
    this.dispatchEvent(new CustomEvent('delete', { 
      detail: { image: this._editingImage },
      bubbles: true,
      composed: true
    }));
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
          processingPreset: this._processingPreset
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

  private _triggerUpdate() {
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }
    this._updateTimer = setTimeout(() => this._updatePreview(), 150);
  }

  private async _updatePreview() {
    if (!this._sourceImg || !this._canvas || !this._uploadedImage) return;
    if (!this._sourceImg.complete || this._sourceImg.naturalWidth === 0) return;


    const tempCanvas = this._prepareAdjustedCanvas();
    if (!tempCanvas) return;

    const paletteName = this._palette === 'defaultPalette' ? 'default' : 
                       this._palette === 'aitjcizeSpectra6Palette' ? 'spectra6' : 
                       this._palette === 'acepPalette' ? 'acep' : 'spectra6';

    const options = {
      ditheringType: this._ditheringType,
      errorDiffusionMatrix: this._errorDiffusionMatrix,
      serpentine: this._serpentine,
      palette: getDefaultPalettes(paletteName),
      processingPreset: this._processingPreset
    };

    try {
      await ditherImage(tempCanvas, this._canvas, options as any);
    } catch (err) {
      console.error('Dithering error:', err);
    }
  }

  private _prepareAdjustedCanvas(): HTMLCanvasElement | null {
    if (!this._sourceImg || !this._sourceImg.complete) return null;
    
    const width = this._sourceImg.naturalWidth;
    const height = this._sourceImg.naturalHeight;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    // Apply brightness, contrast, saturation
    ctx.filter = `brightness(${this._brightness}) contrast(${this._contrast}) saturate(${this._saturation})`;
    ctx.drawImage(this._sourceImg, 0, 0);
    ctx.filter = 'none';

    return tempCanvas;
  }

  private async _handleSuggestSettings() {
    if (!this._sourceImg || !this._uploadedImage) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this._sourceImg.naturalWidth;
    tempCanvas.height = this._sourceImg.naturalHeight;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(this._sourceImg, 0, 0);

    const paletteName = this._palette === 'defaultPalette' ? 'default' : 
                       this._palette === 'aitjcizeSpectra6Palette' ? 'spectra6' : 
                       this._palette === 'acepPalette' ? 'acep' : 'spectra6';
    
    const palette = getDefaultPalettes(paletteName);

    try {
      const suggestion = suggestCanvasProcessingOptions(tempCanvas, palette as any);
      if (suggestion && suggestion.ditherOptions) {
        const opts = suggestion.ditherOptions;
        
        // Update Dithering settings
        if (opts.ditheringType) this._ditheringType = opts.ditheringType;
        if (opts.errorDiffusionMatrix) this._errorDiffusionMatrix = opts.errorDiffusionMatrix;
        
        // Update Preset
        if (opts.processingPreset) this._processingPreset = opts.processingPreset as any;

        // Map Tone Mapping to our sliders if available
        if (opts.toneMapping) {
          if (opts.toneMapping.exposure !== undefined) this._brightness = opts.toneMapping.exposure;
          if (opts.toneMapping.contrast !== undefined) this._contrast = opts.toneMapping.contrast;
          if (opts.toneMapping.saturation !== undefined) this._saturation = opts.toneMapping.saturation;
        }

        this._triggerUpdate();
      }
    } catch (err) {
      console.error('Suggestion error:', err);
    }
  }


  protected updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    
    const propertiesToTriggerUpdate = [
      '_brightness', '_contrast', '_saturation', 
      '_ditheringType', '_errorDiffusionMatrix', '_serpentine',
      '_palette', '_processingPreset',
      '_uploadedImage'
    ];

    if ([...changedProperties.keys()].some(p => propertiesToTriggerUpdate.includes(p))) {
      this._triggerUpdate();
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
                    <!-- Processing Preset -->
                    <div class="form-group horizontal" style="margin-bottom: 0;">
                      <label>Processing Preset</label>
                      <select 
                        .value="${this._processingPreset}"
                        @change="${(e: Event) => this._processingPreset = (e.target as HTMLSelectElement).value as any}"
                      >
                        <option value="">Blank (Default)</option>
                        <option value="balanced">Balanced</option>
                        <option value="dynamic">Dynamic</option>
                        <option value="vivid">Vivid</option>
                        <option value="soft">Soft</option>
                        <option value="greyscale">Greyscale</option>
                      </select>
                    </div>

                    <button class="suggest-button" @click="${this._handleSuggestSettings}">
                      <span class="material-icons">auto_awesome</span>
                      Suggest Settings
                    </button>

                    <hr style="border: 0; border-top: 1px solid var(--border-colour); margin: 0.5rem 0;">

                    <!-- Brightness -->
                    <div class="control-group horizontal">
                      <label>Brightness</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._brightness.toString()}"
                          @input="${(e: InputEvent) => {
                            this._brightness = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._brightness.toFixed(2)}"
                          @input="${(e: InputEvent) => {
                            this._brightness = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                      </div>
                    </div>

                    <!-- Contrast -->
                    <div class="control-group horizontal">
                      <label>Contrast</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._contrast.toString()}"
                          @input="${(e: InputEvent) => {
                            this._contrast = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._contrast.toFixed(2)}"
                          @input="${(e: InputEvent) => {
                            this._contrast = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                      </div>
                    </div>

                    <!-- Saturation -->
                    <div class="control-group horizontal">
                      <label>Saturation</label>
                      <div class="slider-row">
                        <input 
                          type="range" min="0" max="2" step="0.05"
                          .value="${this._saturation.toString()}"
                          @input="${(e: InputEvent) => {
                            this._saturation = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                        <input 
                          type="number" min="0" max="2" step="0.05"
                          .value="${this._saturation.toFixed(2)}"
                          @input="${(e: InputEvent) => {
                            this._saturation = parseFloat((e.target as HTMLInputElement).value);
                            this._processingPreset = '';
                          }}"
                        >
                      </div>
                    </div>

                    <hr style="border: 0; border-top: 1px solid var(--border-colour); margin: 0.5rem 0;">

                    <!-- Dithering Type -->
                    <div class="form-group horizontal" style="margin-bottom: 0;">
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
                      <div class="form-group horizontal" style="margin-bottom: 0;">
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
                      <label class="checkbox-row reversed">
                        <span>Serpentine Dithering</span>
                        <input 
                          type="checkbox"
                          ?checked="${this._serpentine}"
                          @change="${(e: Event) => this._serpentine = (e.target as HTMLInputElement).checked}"
                        >
                      </label>
                    ` : ''}


                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Media & Technical Info (Right) -->
          <div class="media-section">
            <div class="preview-details-card">
              <div 
                class="upload-section"
                style="${this._editingImage ? 'cursor: default; opacity: 0.9;' : ''}"
                @click="${this._editingImage ? null : this._handleUploadClick}"
                @dragover="${this._editingImage ? (e: Event) => e.preventDefault() : this._onDragOver}"
                @dragleave="${this._editingImage ? null : this._onDragLeave}"
                @drop="${this._editingImage ? (e: Event) => e.preventDefault() : this._onDrop}"
              >
                ${this._uploadedImage ? html`
                  <canvas id="preview-canvas" class="preview-image"></canvas>
                  <img 
                    id="source-image"
                    src="api/image/${this._uploadedImage.id}/thumbnail" 
                    style="display: none;"
                    alt="Source for preview"
                    @load="${() => this._triggerUpdate()}"
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

              <div class="preview-controls">
                <label>Display Type</label>
                <select 
                  .value="${this._palette}"
                  @change="${(e: Event) => this._palette = (e.target as HTMLSelectElement).value}"
                >
                  <option value="defaultPalette">Black and White (Default)</option>
                  <option value="aitjcizeSpectra6Palette">Spectra 6</option>
                  <option value="acepPalette">AcEP</option>
                </select>
              </div>

              <table class="summary-table">
                <tr>
                  <th>Dimensions</th>
                  <td>
                    <span class="val">${this._uploadedImage ? `${this._uploadedImage.dimensions.width} × ${this._uploadedImage.dimensions.height}` : '-'}</span><span class="unit">px</span>
                  </td>
                </tr>
                <tr>
                  <th>Format</th>
                  <td><span class="val">${this._uploadedImage?.file_type || '-'}</span></td>
                </tr>
                <tr>
                  <th>Colour Depth</th>
                  <td><span class="val">${this._uploadedImage?.colour_depth || '-'}</span></td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div slot="footer" class="footer-actions">
          ${this._editingImage ? html`
            <button 
              class="danger" 
              style="margin-right: auto;" 
              @click="${this._handleDelete}"
            >
              <span class="material-icons">delete</span>
              Delete
            </button>
          ` : ''}
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
