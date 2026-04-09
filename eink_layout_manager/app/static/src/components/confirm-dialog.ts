import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './shared/base-dialog';
import { commonStyles } from '../styles/common-styles';
import { BaseDialog } from './shared/base-dialog';

export interface ConfirmConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  type?: 'primary' | 'danger';
}

/**
 * A reusable confirmation dialog component using base-dialog.
 */
@customElement('confirm-dialog')
export class ConfirmDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      p { color: var(--text-muted); line-height: 1.5; margin: 0; }
    `
  ];

  @state() private _config: Required<ConfirmConfig> = {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    type: 'primary'
  };

  private _resolve: ((result: boolean) => void) | null = null;

  show(config: ConfirmConfig): Promise<boolean> {
    this._config = { ...this._config, ...config };
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  private _handleConfirm() {
    this._resolve?.(true);
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleCancel() {
    this._resolve?.(false);
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog .title="${this._config.title}">
        <p>${this._config.message}</p>
        <div slot="footer">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="${this._config.type === 'danger' ? 'danger' : 'primary'}" @click="${this._handleConfirm}">
            ${this._config.confirmText}
          </button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'confirm-dialog': ConfirmDialog;
  }
}
