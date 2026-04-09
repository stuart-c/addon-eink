import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

/**
 * A shared base component for all dialogs to provide consistent styling and behavior.
 */
@customElement('base-dialog')
export class BaseDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      dialog {
        border: none;
        border-radius: 12px;
        padding: 0;
        box-shadow: var(--shadow-large);
        width: 450px;
        max-width: 95vw;
        background: #fff;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
      }
      .dialog-container {
        padding: 0;
        display: flex;
        flex-direction: column;
      }
      header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      header h2 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .dialog-body {
        padding: 1.5rem;
        max-height: 70vh;
        overflow-y: auto;
      }
      footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        background: #fff;
      }
    `
  ];

  @property({ type: String }) title = '';

  show() {
    (this.renderRoot.querySelector('dialog') as HTMLDialogElement).showModal();
  }

  close() {
    (this.renderRoot.querySelector('dialog') as HTMLDialogElement).close();
  }

  render() {
    return html`
      <dialog>
        <div class="dialog-container">
          <header>
            <h2>${this.title}</h2>
          </header>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <footer>
            <slot name="footer"></slot>
          </footer>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'base-dialog': BaseDialog;
  }
}
