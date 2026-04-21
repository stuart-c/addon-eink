import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { HaStateController } from './controllers/HaStateController';

import './components/shell/app-header';
import './components/layout/side-bar';
import './components/views/layouts-view';
import './components/views/display-types-view';
import './components/views/images-view';
import './components/views/scenes-view';
import './components/dialogs/item-settings-dialog';
import './components/dialogs/image-dialog';
import './components/dialogs/confirm-dialog';
import './components/shared/section-layout';

import { ItemSettingsDialog } from './components/dialogs/item-settings-dialog';
import { ImageDialog } from './components/dialogs/image-dialog';
import { ConfirmDialog } from './components/dialogs/confirm-dialog';
import { DisplayType, Layout, Image, Scene } from './services/HaApiClient';
import { BaseResourceView } from './components/views/base-resource-view';

@customElement('app-root')
export class AppRoot extends LitElement {
  private state = new HaStateController(this);

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    main {
      flex: 1;
      display: flex;
      background-color: #f0f2f5;
      overflow: hidden;
    }
  `;

  @state() private _isDirty = false;
  @state() private _canDelete = false;

  @query('item-settings-dialog') private _itemDialog!: ItemSettingsDialog;
  @query('image-dialog') private _imageDialog!: ImageDialog;
  @query('confirm-dialog') private _confirmDialog!: ConfirmDialog;
  
  @query('.active-view') private _activeViewComponent?: BaseResourceView;

  private _handleDirtyChange(e: CustomEvent<{ isDirty: boolean }>) {
    this._isDirty = e.detail.isDirty;
  }

  private _handleCanDeleteChange(e: CustomEvent<{ canDelete: boolean }>) {
    this._canDelete = e.detail.canDelete;
  }

  private async _handleRequestConfirmation(e: CustomEvent) {
    const result = await this._confirmDialog.show(e.detail.config);
    e.detail.callback(result);
  }

  private _handleShowMessage(e: CustomEvent<{ text: string, type: 'info' | 'success' | 'error' }>) {
    this.state.showMessage(e.detail.text, e.detail.type);
  }

  private async _handleSave() {
    await this._activeViewComponent?.save();
  }

  private async _handleDiscard() {
    const confirmed = await this._confirmDialog.show({
      title: 'Discard Changes?',
      message: `Are you sure you want to discard all unsaved changes?`,
      confirmText: 'Discard',
      type: 'danger'
    });

    if (confirmed) {
      await this._activeViewComponent?.discard();
      this.state.showMessage('Changes discarded', 'info');
    }
  }

  private async _onHeaderAddItem() {
    if (this.state.activeSection === 'images') {
      this._imageDialog.show();
    } else {
      await this._activeViewComponent?.addNew();
    }
  }

  private async _onHeaderDeleteItem() {
    await this._activeViewComponent?.requestDelete();
  }

  private async _onDeleteLayout(e: CustomEvent<{ layout: Layout }>) {
    const confirmed = await this._confirmDialog.show({
      title: 'Delete Layout?',
      message: `Are you sure you want to permanently remove "${e.detail.layout.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteLayout(e.detail.layout);
    }
  }

  private async _onDeleteDisplayType(e: CustomEvent<DisplayType>) {
    const confirmed = await this._confirmDialog.show({
      title: 'Delete Display Type?',
      message: `Are you sure you want to permanently remove "${e.detail.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteDisplayType(e.detail);
    }
  }

  private async _onDeleteScene(e: CustomEvent<{ scene: Scene }>) {
    const confirmed = await this._confirmDialog.show({
      title: 'Delete Scene?',
      message: `Are you sure you want to permanently remove "${e.detail.scene.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteScene(e.detail.scene);
    }
  }

  private async _onDeleteImage(e: CustomEvent<{ image: Image }>) {
    const confirmed = await this._confirmDialog.show({
      title: 'Delete Image?',
      message: `Are you sure you want to permanently remove "${e.detail.image.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      await this.state.deleteImage(e.detail.image);
    }
  }

  private async _onDeleteLayoutItem(e: CustomEvent<{ id: string }>) {
    const item = this.state.activeLayout?.items.find(i => i.id === e.detail.id);
    const dt = this.state.displayTypes.find(t => t.id === item?.display_type_id);
    
    const confirmed = await this._confirmDialog.show({
      title: 'Delete display?',
      message: `Are you sure you want to remove the "${dt?.name || 'unknown'}" display from this layout?`,
      confirmText: 'Delete',
      type: 'danger'
    });

    if (confirmed) {
      this.state.updateActiveLayout({
        items: this.state.activeLayout?.items.filter(i => i.id !== e.detail.id)
      });
      if (this.state.selectedItemId === e.detail.id) {
        this.state.selectItem(null);
      }
      this.state.showMessage('Item deleted', 'success');
    }
  }

  protected render() {
    return html`
      <app-header 
        .connected="${this.state.connected}"
        .message="${this.state.message}"
        .isSaving="${this.state.isSaving}"
        .isDirty="${this._isDirty}"
        .viewMode="${this.state.viewMode}"
        .activeSection="${this.state.activeSection}"
        .canDelete="${this._canDelete}"
        @save-changes="${this._handleSave}"
        @discard-changes="${this._handleDiscard}"
        @delete-item="${this._onHeaderDeleteItem}"
        @add-item="${this._onHeaderAddItem}"
        @toggle-view-mode="${() => this.state.setViewMode(this.state.viewMode === 'graphical' ? 'yaml' : 'graphical')}"
        @set-section="${(e: CustomEvent) => this.state.setSection(e.detail)}"
      ></app-header>

      <main 
        @dirty-state-change="${this._handleDirtyChange}"
        @can-delete-change="${this._handleCanDeleteChange}"
        @request-confirmation="${this._handleRequestConfirmation}"
        @show-message="${this._handleShowMessage}"
      >
        ${this._renderActiveSection()}
      </main>

      <item-settings-dialog 
        @save="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"
        @delete="${(e: CustomEvent) => this._onDeleteLayoutItem(e)}"
      ></item-settings-dialog>
      <image-dialog @image-saved="${() => this.state.refreshImages()}"></image-dialog>
      <confirm-dialog></confirm-dialog>
    `;
  }

  private _renderActiveSection() {
    switch (this.state.activeSection) {
      case 'layouts':
        return html`
          <layouts-view
            class="active-view"
            .state="${this.state}"
            .layouts="${this.state.layouts}"
            .displayTypes="${this.state.displayTypes}"
            .activeLayout="${this.state.activeLayout}"
            .selectedItemId="${this.state.selectedItemId}"
            .viewMode="${this.state.viewMode}"
            .isSaving="${this.state.isSaving}"
            .isAdding="${this.state.isAddingNew}"
            @switch-layout="${(e: CustomEvent) => this.state.switchLayout(e.detail)}"
            @update-active-layout="${(e: CustomEvent) => this.state.updateActiveLayout(e.detail)}"
            @update-item="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"
            @select-item="${(e: CustomEvent) => this.state.selectItem(e.detail.id)}"
            @edit-item="${(e: CustomEvent) => this._itemDialog.show(this.state.activeLayout?.items.find(i => i.id === e.detail.id)!, this.state.displayTypes)}"
            @delete-item="${this._onDeleteLayoutItem}"
            @delete-layout="${this._onDeleteLayout}"
            @save-layout="${async () => {
              await this.state.saveActiveLayout();
              (this.shadowRoot?.querySelector('layouts-view') as any)?.resetBaseline();
            }}"
            @set-section="${(e: CustomEvent) => this.state.setSection(e.detail)}"
            @prepare-new-layout="${() => this.state.prepareNewLayout()}"
            @delete-display-type="${this._onDeleteDisplayType}"
          ></layouts-view>
        `;
      case 'display-types':
        return html`
          <display-types-view
            class="active-view"
            .state="${this.state}"
            .displayTypes="${this.state.displayTypes}"
            .selectedId="${this.state.selectedDisplayTypeId}"
            .viewMode="${this.state.viewMode}"
            .isAdding="${this.state.isAddingNew}"
            @select-display-type="${(e: CustomEvent) => this.state.selectDisplayType(e.detail.id)}"
            @save="${(e: CustomEvent) => this.state.saveDisplayType(e.detail.displayType)}"
            @delete-display-type="${this._onDeleteDisplayType}"
            @prepare-new-display-type="${() => this.state.selectDisplayType(null)}"
          ></display-types-view>
        `;
      case 'images':
        return html`
          <images-view
            class="active-view"
            .state="${this.state}"
            .images="${this.state.images}"
            .selectedImageId="${this.state.selectedImageId}"
            @edit-image="${(e: CustomEvent) => this._imageDialog.show(e.detail.image)}"
            @image-click="${(e: CustomEvent) => { 
                this.state.selectImage(e.detail.image.id);
            }}"
            @delete-image="${this._onDeleteImage}"
            @filter-change="${(e: CustomEvent) => this.state.refreshImages(e.detail)}"
          ></images-view>
        `;
      case 'scenes':
        return html`
          <scenes-view
            class="active-view"
            .state="${this.state}"
            .scenes="${this.state.scenes}"
            .activeScene="${this.state.activeScene}"
            .viewMode="${this.state.viewMode}"
            @select-scene="${(e: CustomEvent<{ scene: Scene }>) => {
              this.state.switchScene(e.detail.scene);
            }}"
            @delete-scene="${this._onDeleteScene}"
          ></scenes-view>
        `;
      default:
        return html`<div>Section not found</div>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
