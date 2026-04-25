import { LitElement, html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '../shared/base-dialog';
import '../shared/keyword-input';
import { BaseDialog } from '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { ImageDialogController } from '../../controllers/ImageDialogController';

/**
 * A dialog component for adding and processing new images.
 * Adheres to the MVC pattern, delegating logic to ImageDialogController.
 */
@customElement('image-dialog')
export class ImageDialog extends LitElement {
  @query('#preview-canvas') public _canvas!: HTMLCanvasElement;
  @query('#source-image') public _sourceImg!: HTMLImageElement;

  public controller = new ImageDialogController(this as any);

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
        min-height: 200px;
      }

      .upload-section:hover:not(.editing) {
        border-color: var(--primary-colour);
        background: #f0faff;
        transform: translateY(-2px);
      }

      .upload-section.drag-over {
        border-color: var(--primary-colour);
        background: #ebf8ff;
      }

      .upload-section .material-icons {
        font-size: 64px;
        color: #ccd0d4;
        margin-bottom: 1.5rem;
        transition: color 0.2s;
      }

      .upload-section:hover:not(.editing) .material-icons {
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

      .accordion-item {
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        background: white;
        margin-bottom: 0.5rem;
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
        flex: 0 0 140px;
      }

      .slider-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
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
      }

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
      }

      .suggest-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 10px;
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

      .summary-table {
        width: 100%;
        border-collapse: collapse;
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

      .summary-table .val {
        font-weight: 600;
        color: var(--text-colour);
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
      }

      .preview-controls select {
        flex: 1;
        max-width: 200px;
        padding: 6px 10px;
      }
    `
  ];

  async show(image?: any) {
    this.controller.initialise(image);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.controller.processFile(input.files[0]);
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

  private _onDrop(e: DragEvent) {
    e.preventDefault();
    this._onDragLeave();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.controller.processFile(file);
    }
  }

  private async _handleCancel() {
    await this.controller.cancel();
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleDelete() {
    if (!this.controller.editingImage) return;
    this.dispatchEvent(new CustomEvent('delete', { 
      detail: { image: this.controller.editingImage },
      bubbles: true,
      composed: true 
    }));
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private async _handleSave() {
    await this.controller.save();
    if (!this.controller.error) {
      (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
    }
  }

  render() {
    return html`
      <base-dialog title="${this.controller.editingImage ? 'Edit Image' : 'Add New Image'}">
        <div class="dialog-content">
          <div class="metadata-fields">
            ${this.controller.error ? html`
              <div class="error-message">
                <span class="material-icons">error_outline</span>
                ${this.controller.error}
              </div>
            ` : ''}

            <!-- Details Section -->
            <div class="accordion-item ${this.controller.detailsOpen ? 'open' : ''}">
              <div class="accordion-header" @click="${() => this.controller.toggleSection('details')}">
                <h3>Details</h3>
                <span class="material-icons accordion-icon">expand_more</span>
              </div>
              <div class="accordion-content-wrapper">
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    <div class="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        .value="${this.controller.imageName}"
                        @input="${(e: any) => { this.controller.imageName = e.target.value; this.requestUpdate(); }}"
                      >
                    </div>
                    <div class="form-group">
                      <label>Artist</label>
                      <input 
                        type="text" 
                        .value="${this.controller.artist}"
                        @input="${(e: any) => { this.controller.artist = e.target.value; this.requestUpdate(); }}"
                      >
                    </div>
                    <div class="form-group">
                      <label>Collection</label>
                      <input 
                        type="text" 
                        .value="${this.controller.collection}"
                        @input="${(e: any) => { this.controller.collection = e.target.value; this.requestUpdate(); }}"
                      >
                    </div>
                    <div class="form-group">
                      <label>Keywords</label>
                      <keyword-input 
                        .keywords="${this.controller.keywords}"
                        @keywords-changed="${(e: any) => { this.controller.keywords = e.detail.keywords; this.requestUpdate(); }}"
                      ></keyword-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Properties Section -->
            <div class="accordion-item ${this.controller.propertiesOpen ? 'open' : ''}">
              <div class="accordion-header" @click="${() => this.controller.toggleSection('properties')}">
                <h3>Processing Properties</h3>
                <span class="material-icons accordion-icon">expand_more</span>
              </div>
              <div class="accordion-content-wrapper">
                <div class="accordion-content">
                  <div class="accordion-content-inner">
                    <button class="suggest-button" @click="${() => this.controller.suggestSettings()}">
                      <span class="material-icons">auto_awesome</span>
                      Suggest Settings
                    </button>

                    <div class="control-group horizontal">
                      <label>Brightness</label>
                      <div class="slider-row">
                        <input type="range" min="0" max="2" step="0.05" .value="${this.controller.brightness.toString()}" @input="${(e: any) => { this.controller.brightness = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                        <input type="number" min="0" max="2" step="0.05" .value="${this.controller.brightness.toFixed(2)}" @input="${(e: any) => { this.controller.brightness = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                      </div>
                    </div>

                    <div class="control-group horizontal">
                      <label>Contrast</label>
                      <div class="slider-row">
                        <input type="range" min="0" max="2" step="0.05" .value="${this.controller.contrast.toString()}" @input="${(e: any) => { this.controller.contrast = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                        <input type="number" min="0" max="2" step="0.05" .value="${this.controller.contrast.toFixed(2)}" @input="${(e: any) => { this.controller.contrast = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                      </div>
                    </div>

                    <div class="control-group horizontal">
                      <label>Saturation</label>
                      <div class="slider-row">
                        <input type="range" min="0" max="2" step="0.05" .value="${this.controller.saturation.toString()}" @input="${(e: any) => { this.controller.saturation = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                        <input type="number" min="0" max="2" step="0.05" .value="${this.controller.saturation.toFixed(2)}" @input="${(e: any) => { this.controller.saturation = parseFloat(e.target.value); this.controller.processingPreset = ''; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                      </div>
                    </div>

                    <div class="control-group">
                      <label>Dithering</label>
                      <select .value="${this.controller.ditheringType}" @change="${(e: any) => { this.controller.ditheringType = e.target.value; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                        <option value="errorDiffusion">Error Diffusion</option>
                        <option value="ordered">Ordered</option>
                        <option value="random">Random</option>
                        <option value="quantizationOnly">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview & Summary (Right) -->
          <div class="media-section">
            <div class="preview-details-card">
              <div 
                class="upload-section ${this.controller.editingImage ? 'editing' : ''}"
                @click="${() => !this.controller.editingImage && this.shadowRoot?.querySelector<HTMLInputElement>('input[type=file]')?.click()}"
                @dragover="${this._onDragOver}"
                @dragleave="${this._onDragLeave}"
                @drop="${this._onDrop}"
              >
                ${this.controller.uploadedImage ? html`
                  <canvas id="preview-canvas" class="preview-image"></canvas>
                  <img 
                    id="source-image"
                    src="api/image/${this.controller.uploadedImage.id}/thumbnail" 
                    style="display: none;"
                    @load="${() => this.controller.triggerUpdate()}"
                  >
                ` : html`
                  <span class="material-icons">${this.controller.isUploading ? 'sync' : 'cloud_upload'}</span>
                  <p>${this.controller.isUploading ? 'Uploading...' : 'Drag & Drop Image'}</p>
                  <p class="hint">or click to browse</p>
                `}
                <input type="file" style="display: none;" accept="image/*" @change="${this._onFileChange}">
              </div>

              <div class="preview-controls">
                <label>Palette</label>
                <select .value="${this.controller.palette}" @change="${(e: any) => { this.controller.palette = e.target.value; this.controller.triggerUpdate(); this.requestUpdate(); }}">
                  <option value="aitjcizeSpectra6Palette">Spectra 6</option>
                  <option value="acepPalette">ACeP</option>
                  <option value="defaultPalette">B&W</option>
                </select>
              </div>

              <table class="summary-table">
                <tr><th>Size</th><td><span class="val">${this.controller.uploadedImage ? `${this.controller.uploadedImage.dimensions.width}×${this.controller.uploadedImage.dimensions.height}px` : '-'}</span></td></tr>
                <tr><th>Format</th><td><span class="val">${this.controller.uploadedImage?.file_type || '-'}</span></td></tr>
              </table>
            </div>
          </div>
        </div>

        <div slot="footer" class="footer-actions">
          ${this.controller.editingImage ? html`
            <button class="danger" style="margin-right: auto;" @click="${this._handleDelete}">
              <span class="material-icons">delete</span> Delete
            </button>
          ` : ''}
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button .disabled="${this.controller.isUploading || !this.controller.uploadedImage}" @click="${this._handleSave}">
            <span class="material-icons">save</span> Save
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
