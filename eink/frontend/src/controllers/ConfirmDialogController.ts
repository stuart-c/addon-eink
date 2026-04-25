import { BaseViewController } from './BaseViewController';

export interface ConfirmConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  type?: 'primary' | 'danger';
  buttons?: Array<{ text: string, value: any, type?: 'primary' | 'danger' | 'secondary' }>;
}

/**
 * Controller for the Confirm Dialog.
 * Manages configuration and resolution of user choices.
 */
export class ConfirmDialogController extends BaseViewController {
  public config: Required<ConfirmConfig> = {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    type: 'primary',
    buttons: []
  };

  private _resolve: ((result: any) => void) | null = null;

  public show(config: ConfirmConfig): Promise<any> {
    this.config = { ...this.config, ...config };
    this.host.requestUpdate();
    
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  public handleChoice(value: any) {
    this._resolve?.(value);
  }
}
