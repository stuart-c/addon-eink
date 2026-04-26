import { LayoutItem, DisplayType, HaDevice } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

export class ItemSettingsController extends BaseViewController {
  public item: LayoutItem | null = null;
  public displayTypes: DisplayType[] = [];
  public haDevices: HaDevice[] = [];

  public initialise(item: LayoutItem, displayTypes: DisplayType[], haDevices: HaDevice[]) {
    this.item = JSON.parse(JSON.stringify(item));
    this.displayTypes = displayTypes;
    this.haDevices = haDevices;
    this.host.requestUpdate();
  }

  public updateItem(updates: Partial<LayoutItem>) {
    if (this.item) {
      this.item = { ...this.item, ...updates };
      this.host.requestUpdate();
    }
  }

  public save() {
    if (this.item) {
      this.host.dispatchEvent(new CustomEvent('save', { 
        detail: { 
            id: this.item.id,
            updates: {
                x_mm: parseInt(this.item.x_mm as any),
                y_mm: parseInt(this.item.y_mm as any),
                display_type_id: this.item.display_type_id,
                orientation: this.item.orientation,
                device_id: this.item.device_id
            }
        } 
      }));
    }
  }

  public delete() {
    if (this.item) {
      this.host.dispatchEvent(new CustomEvent('delete', { detail: { id: this.item.id } }));
    }
  }
}
