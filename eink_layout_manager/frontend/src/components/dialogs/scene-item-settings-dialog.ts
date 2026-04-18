import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';

/**
 * A placeholder dialog component for editing the settings of an item in a scene.
 */
@customElement('scene-item-settings-dialog')
export class SceneItemSettingsDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
      }
      .placeholder-content {
        padding: 1rem;
        text-align: center;
        color: var(--text-muted);
      }
      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `
  ];

  @property({ type: Object }) item: any = null;

  async show(item: any) {
    this.item = item;
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
        <div class="placeholder-content">
          <p>This is a placeholder for scene item settings.</p>
          <p>Item ID: ${this.item?.id}</p>
        </div>

        <div slot="footer" class="footer-actions">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" @click="${this._handleOk}">Ok</button>
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
