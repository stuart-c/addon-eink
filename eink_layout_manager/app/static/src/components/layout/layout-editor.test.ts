import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './layout-editor';
import { LayoutEditor } from './layout-editor';

// Mock interactjs
vi.mock('interactjs', () => {
  const mockInteractInstance = {
    draggable: vi.fn().mockReturnThis(),
    resizable: vi.fn().mockReturnThis(),
    unset: vi.fn()
  };
  const mockInteract: any = vi.fn(() => mockInteractInstance);
  mockInteract.modifiers = {
    restrictRect: vi.fn(),
    snap: vi.fn(),
    grid: vi.fn(),
    restrictSize: vi.fn()
  };
  mockInteract.snappers = {
    grid: vi.fn()
  };
  return {
    default: mockInteract,
    __esModule: true
  };
});

describe('LayoutEditor', () => {
  let element: LayoutEditor;
  const mockDisplayTypes = [
    { 
        id: 'dt1', 
        width_mm: 100, 
        height_mm: 100,
        panel_width_mm: 90,
        panel_height_mm: 90,
        frame: { border_width_mm: 5 },
        mat: { colour: '#fff' }
    }
  ];
  const mockItems = [
    { id: 'item1', display_type_id: 'dt1', x_mm: 10, y_mm: 10, orientation: 'landscape' }
  ];

  beforeEach(async () => {
    element = document.createElement('layout-editor') as LayoutEditor;
    element.width_mm = 500;
    element.height_mm = 500;
    element.displayTypes = mockDisplayTypes as any;
    element.items = mockItems as any;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should detect when an item is outside boundaries', async () => {
    // Move item1 outside the 500x500 canvas
    element.items = [
      { id: 'item1', display_type_id: 'dt1', x_mm: 450, y_mm: 450, orientation: 'landscape' }
    ];
    // 450 + 100 = 550 > 500
    
    (element as any)._validateLayout();
    expect(element.items[0].invalid).toBe(true);
  });

  it('should detect overlap between two items', async () => {
    element.items = [
      { id: 'item1', display_type_id: 'dt1', x_mm: 10, y_mm: 10, orientation: 'landscape' },
      { id: 'item2', display_type_id: 'dt1', x_mm: 50, y_mm: 50, orientation: 'landscape' }
    ];
    // item1 is 10-110, 10-110
    // item2 is 50-150, 50-150 -> Overlap!
    
    (element as any)._validateLayout();
    expect(element.items[0].invalid).toBe(true);
    expect(element.items[1].invalid).toBe(true);
  });

  it('should handle rotated items in overlap detection', async () => {
    // Define a non-square display type to test rotation logic
    const oblongDT = { id: 'dt-oblong', width_mm: 200, height_mm: 100 };
    element.displayTypes = [...mockDisplayTypes, oblongDT] as any;
    
    element.items = [
      { id: 'item1', display_type_id: 'dt-oblong', x_mm: 0, y_mm: 0, orientation: 'landscape' },   // 200x100
      { id: 'item2', display_type_id: 'dt-oblong', x_mm: 210, y_mm: 0, orientation: 'portrait' } // 100x200 (rotated)
    ];
    
    (element as any)._validateLayout();
    expect(element.items[0].invalid).toBe(false);
    expect(element.items[1].invalid).toBe(false);
    
    // Move rotated item to overlap
    element.items[1].x_mm = 150;
    (element as any)._validateLayout();
    expect(element.items[0].invalid).toBe(true);
    expect(element.items[1].invalid).toBe(true);
  });

  it('should calculate scale based on container size', () => {
    // Mock getBoundingClientRect
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
      height: 1000,
      top: 0, left: 0, bottom: 1000, right: 1000, x: 0, y: 0, toJSON: () => {}
    });
    
    (element as any)._updateScale();
    // width_mm = 500, height_mm = 500
    // padding = 80 -> available = 920
    // scale = 920 / 500 = 1.84
    expect((element as any)._scale).toBeCloseTo(1.84, 1);
  });

  it('should emit select-item event when box is clicked', async () => {
    const selectSpy = vi.fn();
    element.addEventListener('select-item', selectSpy);
    
    const box = element.shadowRoot?.querySelector('layout-box');
    box?.dispatchEvent(new CustomEvent('mousedown'));
    
    expect(selectSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'item1' }
    }));
  });
});
