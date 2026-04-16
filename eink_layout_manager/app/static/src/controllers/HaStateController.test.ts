import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HaStateController } from './HaStateController';
import { api } from '../services/HaApiClient';

// Mock the API singleton
vi.mock('../services/HaApiClient', () => {
  return {
    api: {
      ping: vi.fn(),
      getCollection: vi.fn(),
      getImages: vi.fn(),
      createItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
    },
  };
});

// A dummy host for the controller
const mockHost = {
  addController: vi.fn(),
  requestUpdate: vi.fn(),
  updateComplete: Promise.resolve(true),
};

describe('HaStateController', () => {
  let controller: HaStateController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new HaStateController(mockHost as any);
  });

  it('should initialise with default values', () => {
    expect(controller.connected).toBe(false);
    expect(controller.displayTypes).toEqual([]);
    expect(controller.layouts).toEqual([]);
    expect(controller.activeLayout).toBe(null);
  });

  it('should refresh and set connected state', async () => {
    vi.mocked(api.ping).mockResolvedValue(true);
    vi.mocked(api.getCollection).mockResolvedValue([]);
    vi.mocked(api.getImages).mockResolvedValue([]);
    
    // Mock the createItem call during createDefaultLayout
    vi.mocked(api.createItem).mockResolvedValue({ id: 'default', items: [] } as any);

    await controller.refresh();

    expect(api.ping).toHaveBeenCalled();
    expect(controller.connected).toBe(true);
    expect(controller.activeLayout).toBeDefined();
    expect(controller.activeLayout === null).toBe(false);
    expect(controller.activeLayout!.id).toBe('default');
  });

  it('should handle failed ping', async () => {
    vi.mocked(api.ping).mockResolvedValue(false);

    await controller.refresh();

    expect(controller.connected).toBe(false);
    expect(api.getCollection).toHaveBeenCalledTimes(0);
  });

  it('should switch layouts', () => {
    const layout1 = { id: 'l1', name: 'L1', items: [] } as any;
    const layout2 = { id: 'l2', name: 'L2', items: [] } as any;
    
    controller.layouts = [layout1, layout2];
    controller.switchLayout(layout2);

    expect(controller.activeLayout).toBe(layout2);
    expect(controller.selectedItemId).toBe(null);
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });

  it('should update active layout fields', () => {
    controller.activeLayout = { id: 'l1', name: 'Original', items: [] } as any;
    
    controller.updateActiveLayout({ name: 'Updated' });

    expect(controller.activeLayout!.name).toBe('Updated');
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });

  it('should track dirty state correctly', () => {
    const layout = { id: 'l1', name: 'Original', items: [] } as any;
    controller.switchLayout(layout);
    
    expect(controller.isDirty).toBe(false);
    
    controller.updateActiveLayout({ name: 'Changed' });
    expect(controller.isDirty).toBe(true);
    
    controller.updateActiveLayout({ name: 'Original' });
    expect(controller.isDirty).toBe(false);
  });

  it('should discard changes correctly', () => {
    const layout = { id: 'l1', name: 'Original', items: [] } as any;
    controller.switchLayout(layout);
    
    controller.updateActiveLayout({ name: 'Changed' });
    expect(controller.activeLayout?.name).toBe('Changed');
    
    controller.discardChanges();
    expect(controller.activeLayout?.name).toBe('Original');
    expect(controller.isDirty).toBe(false);
  });

  it('should switch sections', () => {
    expect(controller.activeSection).toBe('layouts');
    
    controller.setSection('images');
    expect(controller.activeSection).toBe('images');
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });

  it('should track selectedImageId', () => {
    expect(controller.selectedImageId).toBe(null);
    controller.selectedImageId = 'img1';
    expect(controller.selectedImageId).toBe('img1');
  });

  it('should delete image, refresh, and clear selection', async () => {
    const mockImage = { id: 'img1', name: 'Delete Me' } as any;
    controller.selectedImageId = 'img1';
    
    vi.mocked(api.deleteItem).mockResolvedValue({} as any);
    vi.mocked(api.ping).mockResolvedValue(true);
    vi.mocked(api.getCollection).mockResolvedValue([]);
    vi.mocked(api.getImages).mockResolvedValue([]);
    
    const result = await controller.deleteImage(mockImage);
    
    expect(result).toBe(true);
    expect(api.deleteItem).toHaveBeenCalledWith('image', 'img1');
    expect(controller.selectedImageId).toBe(null);
    expect(api.getImages).toHaveBeenCalled();
  });

  describe('Deep Linking', () => {
    beforeEach(() => {
      window.location.hash = '';
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should update hash when section changes', () => {
      controller.setSection('images');
      expect(window.location.hash).toBe('#/images');
    });

    it('should update hash when layout changes', () => {
      const layout = { id: 'test_layout', name: 'Test', items: [] } as any;
      controller.layouts = [layout];
      controller.switchLayout(layout);
      expect(window.location.hash).toBe('#/layouts/test_layout');
    });

    it('should update hash when item is selected', () => {
      const layout = { id: 'test_layout', name: 'Test', items: [] } as any;
      controller.layouts = [layout];
      controller.activeLayout = layout;
      controller.selectItem('item_123');
      expect(window.location.hash).toBe('#/layouts/test_layout/item/item_123');
    });

    it('should update hash when view mode changes', () => {
      controller.setViewMode('yaml');
      expect(window.location.hash).toBe('#/layouts?mode=yaml');
    });

    it('should apply state from hash on init/refresh', async () => {
      window.location.hash = '#/images/img_456?mode=yaml';
      
      vi.mocked(api.ping).mockResolvedValue(true);
      vi.mocked(api.getCollection).mockResolvedValue([]);
      vi.mocked(api.getImages).mockResolvedValue([{ id: 'img_456', name: 'Test' }] as any);
      
      await controller.refresh();
      
      expect(controller.activeSection).toBe('images');
      expect(controller.selectedImageId).toBe('img_456');
      expect(controller.viewMode).toBe('yaml');
    });

    it('should apply state from hash on hashchange', () => {
      const layout = { id: 'l1', name: 'L1', items: [] } as any;
      controller.layouts = [layout];
      
      window.location.hash = '#/layouts/l1/item/i1?mode=yaml';
      // Trigger the listener manually if needed, or rely on window event
      // Since we mocked the listener in hostConnected, we can just call _applyHash for unit test
      (controller as any)._applyHash();
      
      expect(controller.activeSection).toBe('layouts');
      expect(controller.activeLayout?.id).toBe('l1');
      expect(controller.selectedItemId).toBe('i1');
      expect(controller.viewMode).toBe('yaml');
    });

    it('should handle missing or invalid segments in hash', () => {
      window.location.hash = '#/invalid-section/foo';
      (controller as any)._applyHash();
      
      // Should stay on layouts (default)
      expect(controller.activeSection).toBe('layouts');
    });
  });
});
