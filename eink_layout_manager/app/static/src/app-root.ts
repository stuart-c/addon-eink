import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { HaStateController, type AppSection } from './controllers/HaStateController';

import './components/shell/app-header';
import './components/layout/side-bar';
import './components/views/layouts-view';
import './components/views/display-types-view';
import { DisplayTypesView } from './components/views/display-types-view';
import { LayoutsView } from './components/views/layouts-view';
import './components/views/images-view';
import './components/dialogs/item-settings-dialog';
import './components/dialogs/image-dialog';
import './components/dialogs/confirm-dialog';
import './components/shared/empty-view';
import './components/shared/section-layout';

import { ItemSettingsDialog } from './components/dialogs/item-settings-dialog';
import { ImageDialog } from './components/dialogs/image-dialog';
import { ConfirmDialog } from './components/dialogs/confirm-dialog';
import { DisplayType, Layout } from './services/HaApiClient';

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

  @state() private _viewMode: 'graphical' | 'yaml' = 'graphical';
  @state() private _isDirty = false;
  @state() private _canDelete = false;

  @query('item-settings-dialog') private _itemDialog!: ItemSettingsDialog;
  @query('image-dialog') private _imageDialog!: ImageDialog;
  @query('confirm-dialog') private _confirmDialog!: ConfirmDialog;
  
  @query('display-types-view') private _displayTypesView?: DisplayTypesView;
  @query('layouts-view') private _layoutsView?: LayoutsView;

  private get _activeView(): any {
    return this.state.activeSection === 'layouts' ? this._layoutsView : 
           this.state.activeSection === 'display-types' ? this._displayTypesView : 
           null;
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('activeSection')) {
      // Small delay to let the query selectors update if the view changed
      setTimeout(() => this._updateHeaderState(), 0);
    }
  }

  private _updateHeaderState() {
    const view = this._activeView;
    if (view) {
      this._isDirty = view.isDirty;
      this._canDelete = view.canDelete;
    } else {
      this._isDirty = false;
      this._canDelete = false;
    }
  }

  private async _handleSave() {
    await this._activeView?.save();
  }

  private async _handleDiscard() {
    const sectionName = this.state.activeSection === 'layouts' ? 'layout' : 'display type';
    const confirmed = await this._confirmDialog.show({
      title: 'Discard Changes?',
      message: `Are you sure you want to discard all unsaved changes to this ${sectionName}?`,
      confirmText: 'Discard',
      type: 'danger'
    });

    if (confirmed) {
      await this._activeView?.discard();
      this.state.showMessage('Changes discarded', 'info');
    }
  }

  private async _onHeaderAddItem() {
    if (this.state.activeSection === 'images') {
      this._imageDialog.show();
    } else {
      await this._activeView?.addNew();
    }
  }

  private async _onHeaderDeleteItem() {
    await this._activeView?.requestDelete();
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

  private async _onDeleteItem(e: CustomEvent<{ id: string }>) {
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
        this.state.selectedItemId = null;
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
        .viewMode="${this._viewMode}"
        .activeSection="${this.state.activeSection}"
        .canDelete="${this._canDelete}"
        @save-changes="${this._handleSave}"
        @discard-changes="${this._handleDiscard}"
        @delete-item="${this._onHeaderDeleteItem}"
        @add-item="${this._onHeaderAddItem}"
        @toggle-view-mode="${() => this._viewMode = (this._viewMode === 'graphical' ? 'yaml' : 'graphical')}"
        @set-section="${(e: CustomEvent) => this.state.setSection(e.detail)}"
      ></app-header>

      ${this.state.activeSection === 'layouts' ? this._renderLayoutsSection() : 
        this.state.activeSection === 'display-types' ? this._renderDisplayTypesSection() :
        this.state.activeSection === 'images' ? this._renderImagesSection() :
        this._renderEmptySection()}

      <item-settings-dialog 
        @save="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"
        @delete="${(e: CustomEvent) => this._onDeleteItem(e)}"
      ></item-settings-dialog>
      <image-dialog></image-dialog>
      <confirm-dialog></confirm-dialog>
    `;
  }

  private _renderLayoutsSection() {
    return html`
      <layouts-view
        .layouts="${this.state.layouts}"
        .displayTypes="${this.state.displayTypes}"
        .activeLayout="${this.state.activeLayout}"
        .selectedItemId="${this.state.selectedItemId}"
        .viewMode="${this._viewMode}"
        .isSaving="${this.state.isSaving}"
        @switch-layout="${(e: CustomEvent) => this.state.switchLayout(e.detail)}"
        @update-active-layout="${(e: CustomEvent) => this.state.updateActiveLayout(e.detail)}"
        @update-item="${(e: CustomEvent) => this.state.updateItem(e.detail.id, e.detail.updates)}"
        @select-item="${(e: CustomEvent) => this.state.selectedItemId = e.detail.id}"
        @edit-item="${(e: CustomEvent) => this._itemDialog.show(this.state.activeLayout?.items.find(i => i.id === e.detail.id)!, this.state.displayTypes)}"
        @delete-item="${this._onDeleteItem}"
        @delete-layout="${this._onDeleteLayout}"
        @save-layout="${async () => {
          await this.state.saveActiveLayout();
          if (this._layoutsView) {
            this._layoutsView.resetBaseline();
          }
        }}"
        @dirty-state-change="${(e: CustomEvent) => this._isDirty = e.detail.isDirty}"
        @can-delete-change="${(e: CustomEvent) => this._canDelete = e.detail.canDelete}"
        @show-message="${(e: CustomEvent) => this.state.showMessage(e.detail.text, e.detail.type)}"
        @set-section="${(e: CustomEvent) => this.state.setSection(e.detail)}"
        @delete-display-type="${this._onDeleteDisplayType}"
      ></layouts-view>
    `;
  }

  private _renderDisplayTypesSection() {
    return html`
      <display-types-view
        .displayTypes="${this.state.displayTypes}"
        .viewMode="${this._viewMode}"
        @save="${(e: CustomEvent) => this.state.saveDisplayType(e.detail.displayType)}"
        @delete-display-type="${this._onDeleteDisplayType}"
        @dirty-state-change="${(e: CustomEvent) => this._isDirty = e.detail.isDirty}"
        @can-delete-change="${(e: CustomEvent) => this._canDelete = e.detail.canDelete}"
        @request-confirmation="${async (e: CustomEvent) => {
          const result = await this._confirmDialog.show(e.detail.config);
          e.detail.callback(result);
        }}"
      ></display-types-view>
    `;
  }

  private _renderImagesSection() {
    return html`
      <images-view
        .images="${this.state.images}"
      ></images-view>
    `;
  }

  private _renderEmptySection() {
    const sections = {
      'scenes': { title: 'Smart Scenes', icon: 'landscape', message: 'Compose complex scenes by combining layouts, images and live data.' }
    };
    const active = sections[this.state.activeSection as Exclude<AppSection, 'layouts' | 'display-types' | 'images'>];
    
    return html`
      <section-layout>
        <div slot="left-bar" style="padding: 1rem; color: #666; font-size: 14px;">
          Sidebar for ${active.title} section coming soon.
        </div>
        <div slot="right-top-bar" style="font-weight: 600; color: #333;">
          ${active.title} Toolbar
        </div>
        <empty-view 
          slot="right-main"
          .title="${active.title}"
          .icon="${active.icon}"
          .message="${active.message}"
        ></empty-view>
      </section-layout>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
