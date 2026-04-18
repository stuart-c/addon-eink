import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './app-root';
import { AppRoot } from './app-root';

// Mock the API
vi.mock('./services/HaApiClient', () => {
  return {
    api: {
      ping: vi.fn().mockResolvedValue(true),
      getCollection: vi.fn().mockResolvedValue([]),
      getImages: vi.fn().mockResolvedValue([]),
      getKeywords: vi.fn().mockResolvedValue([]),
      createItem: vi.fn().mockResolvedValue({ id: 'default', items: [] }),
    },
    HaApiClient: vi.fn()
  };
});

describe('AppRoot', () => {
  let element: AppRoot;

  beforeEach(async () => {
    vi.clearAllMocks();
    element = document.createElement('app-root') as AppRoot;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the app header', () => {
    const header = element.shadowRoot?.querySelector('app-header');
    expect(header).toBeTruthy();
  });

  it('should switch sections when set-section event is received', async () => {
    const header = element.shadowRoot?.querySelector('app-header');
    header?.dispatchEvent(new CustomEvent('set-section', {
      detail: 'images',
      bubbles: true,
      composed: true
    }));

    await element.updateComplete;
    
    // Check if images-view is rendered (it might take an update cycle)
    const imagesView = element.shadowRoot?.querySelector('images-view');
    expect(imagesView).toBeTruthy();
  });

  it('should toggle view mode when toggle-view-mode event is received', async () => {
    const header = element.shadowRoot?.querySelector('app-header');
    
    // Initial mode should be graphical
    expect((element as any).state.viewMode).toBe('graphical');
    
    header?.dispatchEvent(new CustomEvent('toggle-view-mode', {
      bubbles: true,
      composed: true
    }));

    await element.updateComplete;
    expect((element as any).state.viewMode).toBe('yaml');
  });

  it('should show confirm dialog when discarding changes', async () => {
    // Manually set dirty state to simulate unsaved changes
    (element as any)._isDirty = true;
    await element.updateComplete;

    const confirmDialog = element.shadowRoot?.querySelector('confirm-dialog');
    const showSpy = vi.spyOn((confirmDialog as any), 'show').mockResolvedValue(false);

    const header = element.shadowRoot?.querySelector('app-header');
    header?.dispatchEvent(new CustomEvent('discard-changes', {
      bubbles: true,
      composed: true
    }));

    expect(showSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Discard Changes?'
    }));
  });

  it('should update active scene when select-scene event is received', async () => {
    // Switch to scenes section first
    const header = element.shadowRoot?.querySelector('app-header');
    header?.dispatchEvent(new CustomEvent('set-section', {
      detail: 'scenes',
      bubbles: true,
      composed: true
    }));
    await element.updateComplete;

    const scenesView = element.shadowRoot?.querySelector('scenes-view');
    expect(scenesView).toBeTruthy();

    const testScene = { id: 'test_scene', name: 'Test Scene' };
    (element as any).state.scenes = [testScene];
    
    // Dispatch select-scene event from scenes-view
    scenesView?.dispatchEvent(new CustomEvent('select-scene', {
      detail: { scene: testScene },
      bubbles: true,
      composed: true
    }));

    // Wait for app-root to update and pass property down
    await element.updateComplete;
    
    // Check if scenes-view received the new activeScene
    expect((scenesView as any).activeScene).toEqual(testScene);
  });
});
