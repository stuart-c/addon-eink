import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import { Scene } from '../../services/HaApiClient';

@customElement('scene-dialog')
export class SceneDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      .form-group {
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 14px;
        transition: all 0.2s;
      }
      input:focus {
        outline: none;
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
      }
      .footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `
  ];

  @state() private _name = '';
  @property({ type: Object }) scene: Scene | null = null;

  async show(scene: Scene | null = null) {
    this.scene = scene;
    this._name = scene ? scene.name : '';
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit() {
    if (!this._name.trim()) return;
    
    const eventName = this.scene ? 'save' : 'create';
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        name: this._name,
        id: this.scene?.id
      },
      bubbles: true,
      composed: true
    }));
    
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleCancel() {
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog .title="${this.scene ? 'Edit Smart Scene' : 'Create New Smart Scene'}">
        <div class="form-group">
          <label>Scene Name</label>
          <input 
            type="text" 
            placeholder="e.g. Movie Night" 
            .value="${this._name}"
            @input="${(e: InputEvent) => this._name = (e.target as HTMLInputElement).value}"
            @keyup="${(e: KeyboardEvent) => e.key === 'Enter' && this._handleSubmit()}"
            autofocus
          >
        </div>

        <div slot="footer" class="footer-actions">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" ?disabled="${!this._name.trim()}" @click="${this._handleSubmit}">
            <span class="material-icons">${this.scene ? 'save' : 'add'}</span>
            ${this.scene ? 'Save Changes' : 'Create Scene'}
          </button>
        </div>
      </base-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scene-dialog': SceneDialog;
  }
}
