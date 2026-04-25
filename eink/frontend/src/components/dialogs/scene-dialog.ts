import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import '../shared/base-dialog';
import { BaseDialog } from '../shared/base-dialog';
import { SceneDialogController } from '../../controllers/SceneDialogController';

@customElement('scene-dialog')
export class SceneDialog extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
      }
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

  private controller = new SceneDialogController(this);

  async show(scene: any = null, layouts: any[] = []) {
    this.controller.initialise(scene, layouts);
    await this.updateComplete;
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).show();
  }

  private _handleSubmit() {
    this.controller.submit();
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  private _handleCancel() {
    (this.shadowRoot?.querySelector('base-dialog') as BaseDialog).close();
  }

  render() {
    return html`
      <base-dialog .title="${this.controller.scene ? 'Edit Smart Scene' : 'Create New Smart Scene'}">
        <div class="form-group">
          <label>Scene Name</label>
          <input 
            type="text" 
            placeholder="e.g. Movie Night" 
            .value="${this.controller.name}"
            @input="${(e: any) => { this.controller.name = e.target.value; this.requestUpdate(); }}"
            @keyup="${(e: KeyboardEvent) => e.key === 'Enter' && this._handleSubmit()}"
            autofocus
          >
        </div>

        <div class="form-group">
          <label>Layout</label>
          <select 
            .value="${this.controller.layout}"
            @change="${(e: any) => { this.controller.layout = e.target.value; this.requestUpdate(); }}"
            ?disabled="${this.controller.scene !== null}"
            title="${this.controller.scene ? 'Layout cannot be changed after creation' : ''}"
          >
            ${this.controller.layouts.length === 0 ? html`<option value="" disabled>No layouts available</option>` : ''}
            ${this.controller.layouts.map(l => html`
              <option value="${l.id}" ?selected="${this.controller.layout === l.id}">${l.name}</option>
            `)}
          </select>
          ${this.controller.scene ? html`
            <div style="font-size: 11px; color: #888; margin-top: 4px;">
              <span class="material-icons" style="font-size: 12px; vertical-align: middle;">info</span>
              Layout is fixed after a scene is created.
            </div>
          ` : ''}
        </div>

        <div slot="footer" class="footer-actions">
          <button class="secondary" @click="${this._handleCancel}">Cancel</button>
          <button class="primary" ?disabled="${!this.controller.name.trim() || !this.controller.layout}" @click="${this._handleSubmit}">
            <span class="material-icons">${this.controller.scene ? 'save' : 'add'}</span>
            ${this.controller.scene ? 'Save Changes' : 'Create Scene'}
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
