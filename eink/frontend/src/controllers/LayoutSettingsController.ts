import { Layout } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

export class LayoutSettingsController extends BaseViewController {
  public settings: Partial<Layout> | null = null;

  public initialise(settings: Layout) {
    this.settings = JSON.parse(JSON.stringify(settings));
    this.host.requestUpdate();
  }

  public updateSettings(updates: Partial<Layout>) {
    if (this.settings) {
      this.settings = { ...this.settings, ...updates };
      this.host.requestUpdate();
    }
  }

  public save() {
    if (this.settings) {
       this.host.dispatchEvent(new CustomEvent('save', { detail: { settings: this.settings } }));
    }
  }
}
