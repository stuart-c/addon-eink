import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Scene } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/section-layout';
import '../shared/empty-view';
import '../dialogs/scene-dialog';
import { SceneDialog } from '../dialogs/scene-dialog';

/**
 * A view component for managing Smart Scenes.
 */
@customElement('scenes-view')
export class ScenesView extends LitElement {
  @property({ type: Object }) state!: any;
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .scenes-sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .sidebar-items {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
      }
      .sidebar-item {
        padding: 12px;
        border: 1px solid #eee;
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .sidebar-item:hover {
        border-color: var(--primary-colour);
        background: #f0faff;
      }
      .sidebar-item.selected {
        background: #e1f5fe;
        border-color: var(--primary-colour);
        box-shadow: 0 2px 8px rgba(3,169,244,0.1);
      }
      .sidebar-item-icon {
        color: #888;
      }
      .sidebar-item.selected .sidebar-item-icon {
        color: var(--primary-colour);
      }
      .sidebar-item-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-colour);
      }
    `
  ];

  @property({ type: Array }) scenes: Scene[] = [];
  @property({ type: Object }) activeScene: Scene | null = null;

  @query('scene-dialog') private _sceneDialog!: SceneDialog;

  public addNew() {
    this._sceneDialog.show();
  }

  get isDirty() { return false; }
  get canDelete() { return false; }

  private _handleSelect(scene: Scene) {
    this.dispatchEvent(new CustomEvent('select-scene', {
      detail: { scene },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <section-layout>
        <div slot="left-bar" class="scenes-sidebar">
          <div class="sidebar-items">
            ${this.scenes.map(scene => html`
              <div 
                class="sidebar-item ${this.activeScene?.id === scene.id ? 'selected' : ''}" 
                @click="${() => this._handleSelect(scene)}"
              >
                <span class="material-icons sidebar-item-icon">landscape</span>
                <span class="sidebar-item-name">${scene.name}</span>
              </div>
            `)}
            ${this.scenes.length === 0 ? html`
              <div style="padding: 1rem; color: #666; font-size: 14px; text-align: center;">
                No scenes found.
              </div>
            ` : ''}
          </div>
        </div>

        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          ${this.activeScene ? `Scene: ${this.activeScene.name}` : 'Smart Scenes Toolbar'}
        </div>

        <empty-view 
          slot="right-main"
          title="Smart Scenes"
          icon="landscape"
          message="${this.activeScene ? `You have selected "${this.activeScene.name}". Scene editing is coming soon.` : 'Compose complex scenes by combining layouts, images and live data.'}"
        ></empty-view>
      </section-layout>
      <scene-dialog @create="${(e: CustomEvent) => this.state.createScene(e.detail.name)}"></scene-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scenes-view': ScenesView;
  }
}
