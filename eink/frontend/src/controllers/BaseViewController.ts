import { ReactiveController, ReactiveControllerHost } from 'lit';
import { HaStateController } from './HaStateController';

/**
 * A base class for view and dialog controllers that provides access to the global
 * HaStateController and common utilities like dirty checking and message reporting.
 */
export abstract class BaseViewController implements ReactiveController {
  constructor(protected host: ReactiveControllerHost & { state?: HaStateController } & HTMLElement) {
    this.host.addController(this);
  }

  hostConnected() {
    // Subclasses can override
  }

  hostDisconnected() {
    // Subclasses can override
  }

  /**
   * Access the shared application state.
   */
  get state(): HaStateController {
    if (!this.host.state) {
      throw new Error('HaStateController is not present on the host');
    }
    return this.host.state;
  }

  /**
   * Reports a message via the global state.
   */
  protected showMessage(text: string, type: 'info' | 'success' | 'error' = 'info') {
    this.state.showMessage(text, type);
  }

  /**
   * Dispatches a dirty state change event to notify the shell.
   */
  protected notifyDirty(isDirty: boolean) {
    this.host.dispatchEvent(new CustomEvent('dirty-state-change', {
      detail: { isDirty },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Dispatches a can-delete state change event to notify the shell.
   */
  protected notifyCanDelete(canDelete: boolean) {
    this.host.dispatchEvent(new CustomEvent('can-delete-change', {
      detail: { canDelete },
      bubbles: true,
      composed: true
    }));
  }
}
