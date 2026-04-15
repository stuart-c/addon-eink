import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { DisplayType, Layout } from '../../services/HaApiClient';
import { commonStyles } from '../../styles/common-styles';
import '../layout/app-toolbar';
import '../layout/layout-editor';
import '../layout/yaml-editor';
import '../shared/section-layout';
import { LayoutSettingsDialog } from '../dialogs/layout-settings-dialog';

/**
 * A view component for managing eInk Layouts.
 */
@customElement('layouts-view')
export class LayoutsView extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      .editor-container {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        background: white;
        height: 100%;
      }
      layout-editor, yaml-editor {
        flex: 1;
      }
    `
  ];

  @property({ type: Array }) layouts: Layout[] = [];
  @property({ type: Array }) displayTypes: DisplayType[] = [];
  @property({ type: Object }) activeLayout: Layout | null = null;
  @property({ type: String }) selectedItemId: string | null = null;
  @property({ type: String }) viewMode: 'graphical' | 'yaml' = 'graphical';
  @property({ type: Boolean }) isSaving = false;

  @state() private _mousePos: { x: number | null, y: number | null } = { x: null, y: null };
  @state() private _originalLayout: string | null = null;

  @query('layout-settings-dialog') private _layoutSettingsDialog!: LayoutSettingsDialog;

  protected willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('activeLayout')) {
      const oldLayout = changedProperties.get('activeLayout') as Layout | null;
      // Only reset the baseline if we switched to a DIFFERENT layout (different ID)
      // or if we have no baseline yet.
      if (!this._originalLayout || !oldLayout || (this.activeLayout && oldLayout.id !== this.activeLayout.id)) {
        this.resetBaseline();
      }
      this._updateState();
    }
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
  }

  /**
   * Resets the baseline layout for dirty state tracking.
   * Call this after a successful save or when a new layout is loaded.
   */
  public resetBaseline() {
    this._originalLayout = JSON.stringify(this.activeLayout);
  }

  private _updateState() {
    this.dispatchEvent(new CustomEvent('dirty-state-change', {
      detail: { isDirty: this.isDirty },
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('can-delete-change', {
      detail: { canDelete: !!this.activeLayout },
      bubbles: true,
      composed: true
    }));
  }

  get isDirty() {
    if (!this.activeLayout) return false;
    return JSON.stringify(this.activeLayout) !== this._originalLayout;
  }

  get canDelete() {
    return !!this.activeLayout;
  }

  public async save() {
    this.dispatchEvent(new CustomEvent('save-layout', {
      detail: { layout: this.activeLayout },
      bubbles: true,
      composed: true
    }));
  }

  public async discard() {
    if (this._originalLayout) {
      const layout = JSON.parse(this._originalLayout);
      this.dispatchEvent(new CustomEvent('update-active-layout', {
        detail: layout,
        bubbles: true,
        composed: true
      }));
      this.selectedItemId = null;
    }
  }

  public async addNew() {
    const newLayout: Partial<Layout> = {
      name: 'New Layout',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    };
    await this._layoutSettingsDialog.show(newLayout as Layout);
  }

  public async requestDelete() {
    if (!this.activeLayout) return;
    this.dispatchEvent(new CustomEvent('delete-layout', {
      detail: { layout: this.activeLayout },
      bubbles: true,
      composed: true
    }));
  }

  private _onAddItemToLayout(e: CustomEvent<DisplayType>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      display_type_id: e.detail.id,
      x_mm: 50,
      y_mm: 50,
      orientation: 'landscape' as 'landscape' | 'portrait'
    };
    
    if (this.activeLayout) {
      const updates = {
        items: [...(this.activeLayout.items || []), newItem]
      };
      this._updateActiveLayout(updates);
      this._selectItem(id);
    }
  }

  private _updateActiveLayout(updates: Partial<Layout>) {
    this.dispatchEvent(new CustomEvent('update-active-layout', {
      detail: updates,
      bubbles: true,
      composed: true
    }));
  }

  private _selectItem(id: string | null) {
    this.dispatchEvent(new CustomEvent('select-item', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }

  private _updateItem(id: string, updates: Partial<any>) {
    this.dispatchEvent(new CustomEvent('update-item', {
      detail: { id, updates },
      bubbles: true,
      composed: true
    }));
  }

  private async _onEditItem(e: CustomEvent<{ id: string }>) {
    this.dispatchEvent(new CustomEvent('edit-item', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  private async _onDeleteItem(e: CustomEvent<{ id: string }>) {
    this.dispatchEvent(new CustomEvent('delete-item', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <section-layout>
        <side-bar
          slot="left-bar"
          .displayTypes="${this.displayTypes}"
          .activeLayout="${this.activeLayout}"
          .selectedItemId="${this.selectedItemId}"
          @add-display-type="${() => this.dispatchEvent(new CustomEvent('set-section', { detail: 'display-types', bubbles: true, composed: true }))}"
          @edit-display-type="${() => this.dispatchEvent(new CustomEvent('set-section', { detail: 'display-types', bubbles: true, composed: true }))}"
          @delete-display-type="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('delete-display-type', { detail: e.detail, bubbles: true, composed: true }))}"
          @add-item-to-layout="${this._onAddItemToLayout}"
          @select-item="${(e: CustomEvent) => this._selectItem(e.detail.id)}"
          @edit-item="${this._onEditItem}"
          @rotate-item="${(e: CustomEvent) => this._updateItem(e.detail.id, { orientation: (this.activeLayout?.items.find(i => i.id === e.detail.id)?.orientation === 'landscape' ? 'portrait' : 'landscape') })}"
          @delete-item="${this._onDeleteItem}"
        ></side-bar>

        <app-toolbar
          slot="right-top-bar"
          .layouts="${this.layouts}"
          .displayTypes="${this.displayTypes}"
          .activeLayout="${this.activeLayout}"
          .mousePos="${this._mousePos}"
          @switch-layout="${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('switch-layout', { detail: e.detail, bubbles: true, composed: true }))}"
          @create-layout="${this.addNew}"
          @edit-layout="${() => this.activeLayout && this._layoutSettingsDialog.show(this.activeLayout)}"
          @add-item-to-layout="${this._onAddItemToLayout}"
        ></app-toolbar>

        <div slot="right-main" style="height: 100%; display: flex; flex-direction: column;">
          <layout-editor
            ?hidden="${this.viewMode !== 'graphical' || !this.activeLayout}"
            .width_mm="${this.activeLayout?.canvas_width_mm || 0}"
            .height_mm="${this.activeLayout?.canvas_height_mm || 0}"
            .gridSnap="${this.activeLayout?.grid_snap_mm || 5}"
            .items="${this.activeLayout?.items || []}"
            .displayTypes="${this.displayTypes}"
            .selectedId="${this.selectedItemId}"
            @item-moved="${(e: CustomEvent) => this._updateItem(e.detail.id, { x_mm: e.detail.x, y_mm: e.detail.y })}"
            @select-item="${(e: CustomEvent) => this._selectItem(e.detail.id)}"
            @edit-item="${(e: CustomEvent) => this._onEditItem(e)}"
            @mouse-move="${(e: CustomEvent) => this._mousePos = e.detail}"
            @rotate-item="${(e: CustomEvent) => this._updateItem(e.detail.id, { orientation: (this.activeLayout?.items.find(i => i.id === e.detail.id)?.orientation === 'landscape' ? 'portrait' : 'landscape') })}"
            @item-delete="${(e: CustomEvent) => this._onDeleteItem(e)}"
            @layout-resized="${(e: CustomEvent) => this._updateActiveLayout({ canvas_width_mm: e.detail.width, canvas_height_mm: e.detail.height })}"
          ></layout-editor>

          <yaml-editor
            ?hidden="${this.viewMode !== 'yaml' || !this.activeLayout}"
            .data="${this.activeLayout}"
            .schemaName="Layout"
            @data-update="${(e: CustomEvent) => this._updateActiveLayout(e.detail)}"
          ></yaml-editor>
        </div>
      </section-layout>

      <layout-settings-dialog @save="${(e: CustomEvent) => {
        this._updateActiveLayout(e.detail.settings);
        this.dispatchEvent(new CustomEvent('show-message', { detail: { text: 'Settings applied', type: 'success' }, bubbles: true, composed: true }));
      }}"></layout-settings-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'layouts-view': LayoutsView;
  }
}
