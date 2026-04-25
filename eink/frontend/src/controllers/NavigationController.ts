import { ReactiveController, ReactiveControllerHost } from 'lit';

export type AppSection = 'display-types' | 'layouts' | 'images' | 'scenes';
export type ViewMode = 'graphical' | 'yaml';

export class NavigationController implements ReactiveController {
  public activeSection: AppSection = 'layouts';
  public viewMode: ViewMode = 'graphical';
  public activeLayoutId: string | null = null;
  public selectedItemId: string | null = null;
  public selectedImageId: string | null = null;
  public selectedDisplayTypeId: string | null = null;
  public activeSceneId: string | null = null;
  public isAddingNew = false;
  public onHashApplied?: () => void;

  constructor(private host: ReactiveControllerHost) {
    this.host.addController(this);
  }

  hostConnected() {
    window.addEventListener('hashchange', this._handleHashChange);
    this._applyHash();
  }

  hostDisconnected() {
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  private _handleHashChange = () => {
    this._applyHash();
  };

  public setSection(section: AppSection) {
    if (this.activeSection !== section) {
      this.activeSection = section;
      this.isAddingNew = false;
      this.updateHash();
      this.host.requestUpdate();
      this.host.dispatchEvent(new CustomEvent('state-changed'));
    }
  }

  public setViewMode(mode: ViewMode) {
    if (this.viewMode !== mode) {
      this.viewMode = mode;
      this.updateHash();
      this.host.requestUpdate();
      this.host.dispatchEvent(new CustomEvent('state-changed'));
    }
  }

  public selectLayout(id: string | null) {
    if (this.activeLayoutId !== id) {
      this.activeLayoutId = id;
      this.selectedItemId = null;
      this.isAddingNew = false;
      this.updateHash();
      this.host.requestUpdate();
    }
  }

  public selectItem(id: string | null) {
    if (this.selectedItemId !== id) {
      this.selectedItemId = id;
      this.updateHash();
      this.host.requestUpdate();
    }
  }

  public selectImage(id: string | null) {
    if (this.selectedImageId !== id) {
      this.selectedImageId = id;
      this.updateHash();
      this.host.requestUpdate();
    }
  }

  public selectDisplayType(id: string | null) {
    this.isAddingNew = (id === 'new');
    if (this.selectedDisplayTypeId !== id) {
      this.selectedDisplayTypeId = id;
      this.updateHash();
      this.host.requestUpdate();
    }
  }

  public selectScene(id: string | null) {
    if (this.activeSceneId !== id) {
      this.activeSceneId = id;
      this.updateHash();
      this.host.requestUpdate();
    }
  }

  public prepareNew() {
    this.isAddingNew = true;
    if (this.activeSection === 'layouts') {
        this.activeLayoutId = 'new';
    } else if (this.activeSection === 'display-types') {
        this.selectedDisplayTypeId = 'new';
    } else if (this.activeSection === 'scenes') {
        this.activeSceneId = 'new';
    }
    this.updateHash();
    this.host.requestUpdate();
    this.host.dispatchEvent(new CustomEvent('state-changed'));
  }

  public updateHash() {
    let hash = `#/${this.activeSection}`;
    
    if (this.activeSection === 'layouts' && this.activeLayoutId !== null) {
      hash += `/${this.activeLayoutId}`;
      if (this.selectedItemId) {
        hash += `/item/${this.selectedItemId}`;
      }
    } else if (this.activeSection === 'scenes' && this.activeSceneId) {
      hash += `/${this.activeSceneId}`;
    } else if (this.activeSection === 'images' && this.selectedImageId) {
      hash += `/${this.selectedImageId}`;
    } else if (this.activeSection === 'display-types' && this.selectedDisplayTypeId) {
      hash += `/${this.selectedDisplayTypeId}`;
    }

    if (this.viewMode === 'yaml') {
      hash += '?mode=yaml';
    }

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }

  private _applyHash() {
    const hash = window.location.hash || '#/layouts';
    const [pathPart, queryPart] = hash.split('?');
    const path = pathPart.substring( pathPart.startsWith('#/') ? 2 : (pathPart.startsWith('#') ? 1 : 0) );
    const segments = path.split('/');
    
    const params = new URLSearchParams(queryPart || '');
    const mode = params.get('mode') as ViewMode;
    if (mode === 'yaml' || mode === 'graphical') {
      this.viewMode = mode;
    }

    const section = segments[0] as AppSection;
    if (['display-types', 'layouts', 'images', 'scenes'].includes(section)) {
      this.activeSection = section;
    }

    if (this.activeSection === 'layouts') {
      this.activeLayoutId = segments[1] || null;
      this.selectedItemId = (segments[2] === 'item' && segments[3]) ? segments[3] : null;
      this.isAddingNew = (this.activeLayoutId === 'new');
    } else if (this.activeSection === 'scenes') {
      this.activeSceneId = segments[1] || null;
      this.isAddingNew = (this.activeSceneId === 'new');
    } else if (this.activeSection === 'images') {
      this.selectedImageId = segments[1] || null;
    } else if (this.activeSection === 'display-types') {
      this.selectedDisplayTypeId = segments[1] || null;
      this.isAddingNew = (this.selectedDisplayTypeId === 'new');
    }

    this.host.requestUpdate();
    this.host.dispatchEvent(new CustomEvent('state-changed'));
    if (this.onHashApplied) this.onHashApplied();
  }
}
