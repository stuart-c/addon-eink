import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { HaStateController } from '../../controllers/HaStateController';

/**
 * A base component for main view sections that provides common functionality
 * for interacting with the HaStateController and reporting status to app-root.
 */
export abstract class BaseResourceView extends LitElement {
  /**
    * The application state controller.
    */
  @property({ type: Object }) state!: HaStateController;

  /**
   * Dispatches a 'dirty-state-change' event to notify the shell that the view has unsaved changes.
   */
  protected notifyDirty(isDirty: boolean) {
    this.dispatchEvent(new CustomEvent('dirty-state-change', {
      detail: { isDirty },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Dispatches a 'can-delete-change' event to notify the shell whether the current item can be deleted.
   */
  protected notifyCanDelete(canDelete: boolean) {
    this.dispatchEvent(new CustomEvent('can-delete-change', {
      detail: { canDelete },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Dispatches a 'show-message' event to display a toast notification in the shell.
   */
  protected showMessage(text: string, type: 'info' | 'success' | 'error' = 'info') {
    this.dispatchEvent(new CustomEvent('show-message', {
      detail: { text, type },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Requests user confirmation via a dialog managed by the shell.
   */
  protected async _requestConfirmation(
    config: { title: string, message: string, confirmText?: string, type?: 'primary' | 'danger' | 'secondary', buttons?: any[] },
    callback: (result: any) => void
  ) {
    this.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: { config, callback },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Called by the shell when the user clicks 'Save'.
   */
  public abstract save(): void | Promise<void>;

  /**
   * Called by the shell when the user clicks 'Discard'.
   */
  public abstract discard(): void | Promise<void>;

  /**
   * Called by the shell or toolbar when the user wants to create a new item.
   */
  public abstract addNew(): void | Promise<void>;

  /**
   * Called by the shell when the user clicks 'Delete'.
   */
  public abstract requestDelete(): void | Promise<void>;
}
