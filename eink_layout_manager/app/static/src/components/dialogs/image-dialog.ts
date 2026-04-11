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
        --dialog-width: 720px;
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
        gap: 1.25rem;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 0.75rem;
      }

      /* Custom scrollbar for metadata fields */
      .metadata-fields::-webkit-scrollbar {
        width: 4px;
      }
      .metadata-fields::-webkit-scrollbar-track {
        background: transparent;
      }
      .metadata-fields::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
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

      .error-message {
        background: #fff1f0;
        border: 1px solid #ffa39e;
        color: #f5222d;
        padding: 0.75rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `
  ];

  @state() private _uploadedImage: Image | null = null;
  @state() private _isUploading = false;
  @state() private _error: string | null = null;
  @state() private _keywords: string[] = [];
  @state() private _imageName: string = '';

  async show() {
    this._uploadedImage = null;
    this._isUploading = false;
    this._error = null;
    this._keywords = [];
    this._imageName = '';
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
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
    if (this._uploadedImage) {
      try {
        await api.deleteItem('image', this._uploadedImage.id);
      } catch (err) {
        console.error('Failed to cleanup uploaded image:', err);
      }
    }
    this._uploadedImage = null;
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

  render() {
    return html`
      <base-dialog title="Add New Image">
        <div class="dialog-content">
          <!-- Metadata Fields (Left) -->
          <div class="metadata-fields">
            ${this._error ? html`
              <div class="error-message">
                <span class="material-icons" style="font-size: 18px;">error_outline</span>
                ${this._error}
              </div>
            ` : ''}

            <div class="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Optional - defaults to filename"
                .value="${this._imageName}"
                @input="${(e: InputEvent) => this._imageName = (e.target as HTMLInputElement).value}"
              >
            </div>
            
            <div class="form-group">
              <label>Artist</label>
              <input type="text" placeholder="Who created this?">
            </div>

            <div class="form-group">
              <label>Collection</label>
              <input type="text" placeholder="e.g. Landscapes, Personal">
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea placeholder="Describe the image..."></textarea>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Keywords</label>
              <keyword-input 
                .keywords="${this._keywords}"
                @keywords-changed="${this._handleKeywordsChanged}"
              ></keyword-input>
            </div>

            <div class="grid" style="margin-top: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Width (px)</label>
                <input 
                  type="number" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?.dimensions.width || ''}"
                >
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Height (px)</label>
                <input 
                  type="number" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?.dimensions.height || ''}"
                >
              </div>
            </div>

            <div class="grid" style="margin-top: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Format</label>
                <input 
                  type="text" 
                  readonly 
                  placeholder="Auto-detected"
                  .value="${this._uploadedImage?.file_type || ''}"
                >
              </div>
              <div class="form-group" style="margin-bottom: 0;">
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

          <!-- Upload Drop Zone (Right) -->
          <div 
            class="upload-section"
            @click="${this._handleUploadClick}"
            @dragover="${this._onDragOver}"
            @dragleave="${this._onDragLeave}"
            @drop="${this._onDrop}"
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
            <input 
              type="file" 
              style="display: none;" 
              accept="image/*"
              @change="${this._onFileChange}"
            >
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
            @click="${() => {}}"
          >
            <span class="material-icons">save</span>
            Save Image
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
