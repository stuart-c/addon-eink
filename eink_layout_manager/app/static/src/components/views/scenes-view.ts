import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PropertyValues } from 'lit';
import { Scene } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../shared/section-layout';
import '../shared/empty-view';
import '../layout/yaml-editor';
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
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        width: 100%;
      }
      .toolbar-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .settings-button {
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
        border: 1px solid #ddd;
        cursor: pointer;
        transition: all 0.2s;
        color: #555;
      }
      .settings-button:hover {
        background: #e4e6e9;
        border-color: #ccc;
        color: #333;
      }
      .settings-button .material-icons {
        font-size: 20px;
      }
    `
  ];

  @property({ type: Array }) scenes: Scene[] = [];
  @property({ type: Object }) activeScene: Scene | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';

  @query('scene-dialog') private _sceneDialog!: SceneDialog;

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('activeScene')) {
      this.dispatchEvent(new CustomEvent('can-delete-change', {
        detail: { canDelete: !!this.activeScene },
        bubbles: true,
        composed: true
      }));
      this.dispatchEvent(new CustomEvent('dirty-state-change', {
        detail: { isDirty: false },
        bubbles: true,
        composed: true
      }));
    }
  }

  public addNew() {
    this._sceneDialog.show();
  }

  public async requestDelete() {
    if (!this.activeScene) return;
    this.dispatchEvent(new CustomEvent('delete-scene', {
      detail: { scene: this.activeScene },
      bubbles: true,
      composed: true
    }));
  }

  get isDirty() { return false; }
  get canDelete() { return !!this.activeScene; }

  private _handleSelect(scene: Scene) {
    this.dispatchEvent(new CustomEvent('select-scene', {
      detail: { scene },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const scenes = (this.state?.scenes || this.scenes || []) as Scene[];
    const activeScene = this.state?.activeScene || this.activeScene;

    return html`
      <section-layout>
        <div slot="left-bar" class="scenes-sidebar">
          <div class="sidebar-items">
            ${scenes.map(scene => html`
              <div 
                class="sidebar-item ${activeScene?.id === scene.id ? 'selected' : ''}" 
                @click="${() => this._handleSelect(scene)}"
              >
                <span class="material-icons sidebar-item-icon">landscape</span>
                <span class="sidebar-item-name">${scene.name}</span>
              </div>
            `)}
            ${scenes.length === 0 ? html`
              <div style="padding: 1rem; color: #666; font-size: 14px; text-align: center;">
                No scenes found.
              </div>
            ` : ''}
          </div>
        </div>

        <div slot="right-top-bar" class="toolbar">
          ${activeScene ? html`
            <button id="btn-scene-settings" class="settings-button" @click="${() => this._sceneDialog.show(activeScene)}" title="Scene Settings">
              <span class="material-icons">settings</span>
            </button>
            <div class="toolbar-title">
              <span>${activeScene.name}</span>
            </div>
          ` : html`
            <div class="toolbar-title">Smart Scenes Toolbar</div>
          `}
        </div>

        ${this.viewMode === 'yaml' && activeScene ? html`
          <yaml-editor
            slot="right-main"
            .data="${activeScene}"
            .schemaName="Scene"
            @data-update="${(e: CustomEvent) => this.state.updateScene(activeScene.id, e.detail)}"
          ></yaml-editor>
        ` : html`
          <empty-view 
            slot="right-main"
            title="Smart Scenes"
            icon="landscape"
            message="${activeScene ? `You have selected "${activeScene.name}". Scene editing is coming soon.` : 'Compose complex scenes by combining layouts, images and live data.'}"
          ></empty-view>
        `}
      </section-layout>
      <scene-dialog 
        @create="${(e: CustomEvent) => this.state.createScene(e.detail.name)}"
        @save="${(e: CustomEvent) => this.state.updateScene(e.detail.id, { name: e.detail.name })}"
      ></scene-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scenes-view': ScenesView;
  }
}
