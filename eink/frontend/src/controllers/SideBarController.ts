import { DisplayType, Layout } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the SideBar.
 * Manages display items and selection interactions.
 */
export class SideBarController extends BaseViewController {
  public displayTypes: DisplayType[] = [];
  public activeLayout: Layout | null = null;
  public selectedItemId: string | null = null;

  public initialise(props: {
    displayTypes: DisplayType[];
    activeLayout: Layout | null;
    selectedItemId: string | null;
  }) {
    this.displayTypes = props.displayTypes;
    this.activeLayout = props.activeLayout;
    this.selectedItemId = props.selectedItemId;
    this.host.requestUpdate();
  }

  public selectItem(id: string) {
    this.host.dispatchEvent(new CustomEvent('select-item', { 
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }

  public editItem(id: string) {
    this.host.dispatchEvent(new CustomEvent('edit-item', { 
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }
}
