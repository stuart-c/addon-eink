import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';

/**
 * A dialog component for adding and processing new images.
 * This is currently a shell that allows opening and closing.
 */
@customElement('image-dialog')
export class ImageDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .placeholder-content {
        padding: 2rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #666;
      }
      .placeholder-content .material-icons {
        font-size: 48px;
        color: #ddd;
      }
    `
  ];

  async show() {
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  render() {
    return html`
      <base-dialog title="Add Image">
        <div class="placeholder-content">
          <span class="material-icons">cloud_upload</span>
          <p>Image upload and processing configuration coming soon.</p>
        </div>

        <div slot="footer">
          <button 
            class="secondary" 
            @click="${() => (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close()}"
          >
            Cancel
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
