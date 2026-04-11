import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';

/**
 * A dialog component for adding and processing new images.
 * Currently updated with visual UI for metadata and upload.
 */
@customElement('image-dialog')
export class ImageDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .dialog-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        padding: 0.5rem 0;
        min-width: 600px;
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
    `
  ];

  async show() {
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  render() {
    return html`
      <base-dialog title="Add New Image">
        <div class="dialog-content">
          <!-- Metadata Fields (Left) -->
          <div class="metadata-fields">
            <div class="form-group">
              <label>Name</label>
              <input type="text" placeholder="Optional - defaults to filename">
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
              <input type="text" placeholder="summer, beach, sunset (comma separated)">
            </div>
          </div>

          <!-- Upload Drop Zone (Right) -->
          <div class="upload-section">
            <span class="material-icons">cloud_upload</span>
            <p>Drag & Drop Image</p>
            <p class="hint">or click to browse your files</p>
            <input type="file" style="display: none;" accept="image/*">
          </div>
        </div>

        <div slot="footer" class="footer-actions">
          <button 
            class="secondary" 
            @click="${() => (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close()}"
          >
            Cancel
          </button>
          <button @click="${() => {}}">
            <span class="material-icons">publish</span>
            Upload Image
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
