import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';

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

  async show(item: any) {
    this.item = item;
    // Set initial values from item if available
    if (item.images && item.images.length > 0) {
      this._selectedImageId = item.images[0].image_id;
      this._scalingFactor = item.images[0].scaling_factor || 100;
      this._offsetX = item.images[0].offset?.x || 0;
      this._offsetY = item.images[0].offset?.y || 0;
    } else {
      this._selectedImageId = 'img-1';
    }
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleOk() {
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleCancel() {
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog title="Item Settings">
        <div class="dialog-content">
          <!-- Left Column: Images -->
          <div class="column">
            <div class="column-header">
              <div class="column-title">Images</div>
              <button class="icon-button" title="Add Image">
                <span class="material-icons">add</span>
              </button>
            </div>
            <div class="column-body">
              <div class="image-list">
                ${[1, 2, 3].map(i => html`
                  <div 
                    class="image-item ${this._selectedImageId === `img-${i}` ? 'selected' : ''}"
                    @click="${() => this._selectedImageId = `img-${i}`}"
                  >
                    <div class="image-thumbnail">
                      <span class="material-icons">image</span>
                    </div>
                    <div class="image-name">Sample Image ${i}.jpg</div>
                  </div>
                `)}
              </div>
            </div>
            <div class="column-footer">
              <button class="icon-button danger" title="Delete Image">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>

          <!-- Middle Column: Preview -->
          <div class="column">
            <div class="column-header">
              <div class="column-title">Preview</div>
            </div>
            <div class="column-body" style="padding: 0;">
              <div class="preview-container">
                <div class="preview-placeholder">
                  <span class="material-icons">monochrome_photos</span>
                  <span>Preview will appear here</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Mapping -->
          <div class="column">
            <div class="column-header">
              <div class="column-title">Mapping</div>
            </div>
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
                    @input="${(e: any) => this._scalingFactor = parseInt(e.target.value)}"
                    style="flex: 1;"
                  >
                </div>
                <div class="control-row">
                  <div class="input-with-unit">
                    <input 
                      type="number" 
                      .value="${this._scalingFactor}"
                      @input="${(e: any) => this._scalingFactor = parseInt(e.target.value)}"
                    >
                    <span class="unit-label">%</span>
                  </div>
                  <button class="secondary" style="padding: 6px 12px; font-size: 11px;">FIT</button>
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
                      @input="${(e: any) => this._offsetX = parseInt(e.target.value)}"
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
                      @input="${(e: any) => this._offsetY = parseInt(e.target.value)}"
                    >
                    <span class="unit-label">px</span>
                  </div>
                </div>

                <!-- D-Pad -->
                <div class="dpad">
                  <button class="dpad-btn up" title="Move Up"><span class="material-icons">keyboard_arrow_up</span></button>
                  <button class="dpad-btn left" title="Move Left"><span class="material-icons">keyboard_arrow_left</span></button>
                  <button class="dpad-btn reset" title="Reset Offset"><span class="material-icons">restart_alt</span></button>
                  <button class="dpad-btn right" title="Move Right"><span class="material-icons">keyboard_arrow_right</span></button>
                  <button class="dpad-btn down" title="Move Down"><span class="material-icons">keyboard_arrow_down</span></button>
                </div>
              </div>
            </div>
            <div class="column-footer">
              <button class="secondary" @click="\${() => { this._offsetX = 0; this._offsetY = 0; }}">Reset Mapping</button>
            </div>
          </div>
        </div>

        <div slot="footer" class="footer-actions">
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
