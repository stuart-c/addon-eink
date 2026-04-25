import { DisplayType, Layout } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the App Toolbar.
 * Manages dropdown menus, layout switching, and item addition.
 */
export class AppToolbarController extends BaseViewController {
  public layouts: Layout[] = [];
  public displayTypes: DisplayType[] = [];
  public activeLayout: Layout | null = null;
  public mousePos: { x: number | null, y: number | null } = { x: null, y: null };
  public showMenu = false;
  public showDisplayMenu = false;

  public initialise(props: {
    layouts: Layout[];
    displayTypes: DisplayType[];
    activeLayout: Layout | null;
    mousePos: { x: number | null, y: number | null };
  }) {
    this.layouts = props.layouts;
    this.displayTypes = props.displayTypes;
    this.activeLayout = props.activeLayout;
    this.mousePos = props.mousePos;
    this.host.requestUpdate();
  }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) this.showDisplayMenu = false;
    this.host.requestUpdate();
  }

  public toggleDisplayMenu() {
    this.showDisplayMenu = !this.showDisplayMenu;
    if (this.showDisplayMenu) this.showMenu = false;
    this.host.requestUpdate();
  }

  public closeMenus() {
    this.showMenu = false;
    this.showDisplayMenu = false;
    this.host.requestUpdate();
  }

  public dispatchAction(name: string, detail?: any) {
    this.host.dispatchEvent(new CustomEvent(name, { 
      detail, 
      bubbles: true, 
      composed: true 
    }));
    this.closeMenus();
  }
}
