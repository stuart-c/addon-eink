import { LitElement, html, css } from 'lit';
import './shared/base-dialog.js';
import { commonStyles } from '../styles/common-styles.js';

export class ConfirmDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      p { color: #555; line-height: 1.5; margin: 0; }
    `
  ];

  static properties = {
    _config: { type: Object, state: true },
  };

  constructor() {
    super();
    this._resolve = null;
    this._config = { title: 'Confirm', message: 'Are you sure?', confirmText: 'Confirm', type: 'primary' };
  }

  show(config) {
    this._config = { ...this._config, ...config };
    this.shadowRoot.querySelector('base-dialog').show();
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  _handleConfirm() {
    this._resolve(true);
    this.shadowRoot.querySelector('base-dialog').close();
  }

  _handleCancel() {
    this._resolve(false);
    this.shadowRoot.querySelector('base-dialog').close();
  }

  render() {
    return html`
      <base-dialog .title="${this._config.title}">
        <p>${this._config.message}</p>
        <div slot="footer">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="${this._config.type || 'primary'}" @click="${this._handleConfirm}">${this._config.confirmText}</button>
        </div>
      </base-dialog>
    `;
  }
}
customElements.define('confirm-dialog', ConfirmDialog);
