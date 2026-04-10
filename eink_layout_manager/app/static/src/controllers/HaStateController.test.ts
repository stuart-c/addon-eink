import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HaStateController } from './HaStateController';
import { api } from '../services/HaApiClient';

// Mock the API singleton
vi.mock('../services/HaApiClient', () => {
  return {
    api: {
      ping: vi.fn(),
      getCollection: vi.fn(),
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

  it('should initialize with default values', () => {
    expect(controller.connected).toBe(false);
    expect(controller.displayTypes).toEqual([]);
    expect(controller.layouts).toEqual([]);
    expect(controller.activeLayout).toBe(null);
  });

  it('should refresh and set connected state', async () => {
    vi.mocked(api.ping).mockResolvedValue(true);
    vi.mocked(api.getCollection).mockResolvedValue([]);
    
    // Mock the createItem call during createDefaultLayout
    vi.mocked(api.createItem).mockResolvedValue({ id: 'default' } as any);

    await controller.refresh();

    expect(api.ping).toHaveBeenCalled();
    expect(controller.connected).toBe(true);
    expect(controller.activeLayout).toBeDefined();
    expect(controller.activeLayout).not.toBeNull();
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
});
