import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { BaseDialog } from '../shared/base-dialog';

export interface ConfirmConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  type?: 'primary' | 'danger';
  buttons?: Array<{ text: string, value: any, type?: 'primary' | 'danger' | 'secondary' }>;
}

/**
 * A reusable confirmation dialog component using base-dialog.
 */
@customElement('confirm-dialog')
export class ConfirmDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
      }
      p { color: var(--text-muted); line-height: 1.5; margin: 0; }
    `
  ];

  @state() private _config: Required<ConfirmConfig> = {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    type: 'primary',
    buttons: []
  };

  private _resolve: ((result: boolean) => void) | null = null;

  show(config: ConfirmConfig): Promise<any> {
    this._config = { ...this._config, ...config };
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  private _handleChoice(value: any) {
    this._resolve?.(value);
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog .title="${this._config.title}">
        <p>${this._config.message}</p>
        <div slot="footer">
          ${this._config.buttons && this._config.buttons.length > 0 
            ? this._config.buttons.map(btn => html`
                <button class="${btn.type || 'primary'}" @click="${() => this._handleChoice(btn.value)}">
                  ${btn.text}
                </button>
              `)
            : html`
                <button class="secondary" @click="${() => this._handleChoice(false)}">Cancel</button>
                <button class="${this._config.type === 'danger' ? 'danger' : 'primary'}" @click="${() => this._handleChoice(true)}">
                  ${this._config.confirmText}
                </button>
              `
          }
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
