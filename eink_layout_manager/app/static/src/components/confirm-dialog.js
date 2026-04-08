import { LitElement, html, css } from 'lit';

/**
 * A premium reusable confirmation dialog component.
 */
export class ConfirmDialog extends LitElement {
  static styles = css`
    dialog {
      border: none;
      border-radius: 16px;
      padding: 0;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      width: 400px;
      max-width: 90vw;
      background: white;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
    }

    .container {
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 1.5rem 1.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff1f0;
      color: #f5222d;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #1a1a1a;
      font-weight: 700;
    }

    .content {
      padding: 0 1.75rem 1.5rem 1.75rem;
      color: #555;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    footer {
      padding: 1.25rem 1.75rem;
      background: #fafafa;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      border-top: 1px solid #f0f0f0;
    }

    button {
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cancel {
      background: white;
      color: #666;
      border: 1px solid #d9d9d9;
    }

    .cancel:hover {
      color: #1a1a1a;
      border-color: #999;
      background: #f5f5f5;
    }

    .confirm {
      background: #f5222d;
      color: white;
      box-shadow: 0 2px 0 rgba(0,0,0,0.045);
    }

    .confirm:hover {
      background: #ff4d4f;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 34, 45, 0.2);
    }

    .confirm:active {
      transform: translateY(0);
    }

    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    dialog[open] .container {
      animation: slideIn 0.3s ease-out;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
    }
  `;

  static properties = {
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    type: { type: String }, // 'danger' or 'info'
  };

  constructor() {
    super();
    this.title = 'Are you sure?';
    this.message = 'This action cannot be undone.';
    this.confirmText = 'Confirm';
    this.cancelText = 'Cancel';
    this.type = 'info';
    this._onConfirm = null;
  }

  /**
   * Shows the dialog and returns a promise that resolves to true on confirm, false on cancel.
   */
  async show(options = {}) {
    this.title = options.title || this.title;
    this.message = options.message || this.message;
    this.confirmText = options.confirmText || this.confirmText;
    this.cancelText = options.cancelText || this.cancelText;
    this.type = options.type || this.type;

    return new Promise((resolve) => {
      this._onConfirm = (result) => {
        this.renderRoot.querySelector('dialog').close();
        resolve(result);
      };
      this.renderRoot.querySelector('dialog').showModal();
    });
  }

  _handleCancel() {
    this._onConfirm(false);
  }

  _handleConfirm() {
    this._onConfirm(true);
  }

  render() {
    return html`
      <dialog>
        <div class="container">
          <header>
            <div class="icon-wrapper" style="${this.type === 'danger' ? '' : 'background: #e6f7ff; color: #1890ff;'}">
              <span class="material-icons">${this.type === 'danger' ? 'warning' : 'info'}</span>
            </div>
            <h2>${this.title}</h2>
          </header>
          <div class="content">
            ${this.message}
          </div>
          <footer>
            <button class="cancel" @click="${this._handleCancel}">${this.cancelText}</button>
            <button class="confirm" 
                    style="${this.type === 'danger' ? '' : 'background: #1890ff;'}"
                    @click="${this._handleConfirm}">${this.confirmText}</button>
          </footer>
        </div>
      </dialog>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
