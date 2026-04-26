import { Scene } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

export class SceneDialogController extends BaseViewController {
  public scene: Scene | null = null;
  public name = '';
  public layout = '';
  public layouts: {id: string, name: string}[] = [];

  public initialise(scene: Scene | null, layouts: {id: string, name: string}[]) {
    this.scene = scene;
    this.layouts = layouts;
    this.name = scene ? scene.name : '';
    this.layout = scene ? scene.layout : (this.layouts.length > 0 ? this.layouts[0].id : '');
    this.host.requestUpdate();
  }

  public submit() {
    if (!this.name.trim() || !this.layout) return;
    
    const eventName = this.scene ? 'save' : 'create';
    this.host.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        name: this.name,
        layout: this.layout,
        id: this.scene?.id
      },
      bubbles: true,
      composed: true
    }));
  }
}
