import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../shared/base-dialog';
import { commonStyles } from '../../styles/common-styles';
import { BaseDialog } from '../shared/base-dialog';
import { ConfirmDialogController, ConfirmConfig } from '../../controllers/ConfirmDialogController';
export type { ConfirmConfig };

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

  public controller = new ConfirmDialogController(this);

  async show(config: ConfirmConfig): Promise<any> {
    const promise = this.controller.show(config);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
    return promise;
  }

  private _handleChoice(value: any) {
    this.controller.handleChoice(value);
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog .title="${this.controller.config.title}">
        <p>${this.controller.config.message}</p>
        <div slot="footer">
          ${this.controller.config.buttons && this.controller.config.buttons.length > 0 
            ? this.controller.config.buttons.map(btn => html`
                <button class="${btn.type || 'primary'}" @click="${() => this._handleChoice(btn.value)}">
                  ${btn.text}
                </button>
              `)
            : html`
                <button class="secondary" @click="${() => this._handleChoice(false)}">Cancel</button>
                <button class="${this.controller.config.type === 'danger' ? 'danger' : 'primary'}" @click="${() => this._handleChoice(true)}">
                  ${this.controller.config.confirmText}
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
