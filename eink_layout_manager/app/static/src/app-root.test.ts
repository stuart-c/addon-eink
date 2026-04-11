import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import './app-root';
import { AppRoot } from './app-root';
import { api } from './services/HaApiClient';

// Mock the API
vi.mock('./services/HaApiClient', () => {
  return {
    api: {
      ping: vi.fn().mockResolvedValue(true),
      getCollection: vi.fn().mockResolvedValue([]),
      getImages: vi.fn().mockResolvedValue([]),
    },
    HaApiClient: vi.fn()
  };
});

describe('AppRoot', () => {
  let element: AppRoot;

  beforeEach(async () => {
    vi.clearAllMocks();
    element = await fixture(html`<app-root></app-root>`);
  });

  it('should render the app header', () => {
    const header = element.shadowRoot?.querySelector('app-header');
    expect(header).to.exist;
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
    expect(imagesView).to.exist;
  });

  it('should toggle view mode when toggle-view-mode event is received', async () => {
    const header = element.shadowRoot?.querySelector('app-header');
    
    // Initial mode should be graphical
    expect((element as any)._viewMode).toBe('graphical');
    
    header?.dispatchEvent(new CustomEvent('toggle-view-mode', {
      bubbles: true,
      composed: true
    }));

    await element.updateComplete;
    expect((element as any)._viewMode).toBe('yaml');
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
});
