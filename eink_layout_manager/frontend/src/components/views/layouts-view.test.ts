import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutsView } from './layouts-view';
import './layouts-view';
import '../shared/sidebar-list';
import { Layout, DisplayType } from '../../services/HaApiClient';

describe('LayoutsView', () => {
  let element: LayoutsView;

  const mockLayouts: Layout[] = [
    {
      id: 'l1',
      name: 'Layout 1',
      canvas_width_mm: 500,
      canvas_height_mm: 500,
      grid_snap_mm: 5,
      items: []
    }
  ];

  const mockDisplayTypes: DisplayType[] = [
    {
      id: 'dt1',
      name: 'Display Type 1',
      width_mm: 100,
      height_mm: 60,
      panel_width_mm: 90,
      panel_height_mm: 50,
      width_px: 200,
      height_px: 100,
      colour_type: 'MONO',
      frame: { border_width_mm: 5, colour: '#000000' },
      mat: { colour: '#ffffff' }
    }
  ];

  const mockState = {
    saveActiveLayout: vi.fn(),
    activeLayout: mockLayouts[0],
    showMessage: vi.fn()
  };

  beforeEach(async () => {
    element = document.createElement('layouts-view') as LayoutsView;
    element.state = mockState as any;
    element.layouts = mockLayouts;
    element.displayTypes = mockDisplayTypes;
    element.activeLayout = mockLayouts[0];
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the sidebar-list and toolbar-title', () => {
    const sidebarList = element.shadowRoot?.querySelector('sidebar-list');
    const toolbarTitle = element.shadowRoot?.querySelector('.toolbar-title');
    expect(sidebarList).toBeTruthy();
    expect(toolbarTitle).toBeTruthy();
  });

  it('should reset baseline and report clean when activeLayout changes to a new layout', async () => {
    const spy = vi.fn();
    element.addEventListener('dirty-state-change', spy);
    
    // Switch to a DIFFERENT layout
    element.activeLayout = { ...mockLayouts[0], id: 'l2', name: 'Layout 2' };
    await element.updateComplete;
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        detail: { isDirty: false }
    }));
  });

  it('should report dirty when activeLayout content changes but ID remains same', async () => {
    const spy = vi.fn();
    element.addEventListener('dirty-state-change', spy);
    
    // Modify current layout (baseline is mockLayouts[0])
    element.activeLayout = { ...mockLayouts[0], name: 'Modified' };
    await element.updateComplete;
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        detail: { isDirty: true }
    }));
  });

  it('should call state.saveActiveLayout when save is called', async () => {
    await element.save();
    expect(mockState.saveActiveLayout).toHaveBeenCalled();
  });

  it('should reset activeLayout from baseline and update state when discard is called', async () => {
    const originalName = mockLayouts[0].name;
    
    // Modify current layout (baseline is mockLayouts[0] from beforeEach)
    element.activeLayout = { ...mockLayouts[0], name: 'Modified' };
    await element.updateComplete;
    
    await element.discard();
    
    expect(mockState.activeLayout.name).toEqual(originalName);
  });

  it('should dispatch delete-layout when requestDelete is called', async () => {
    const spy = vi.fn();
    element.addEventListener('delete-layout', spy);
    
    await element.requestDelete();
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { layout: mockLayouts[0] }
    }));
  });

  it('should show the display type menu when add display button is clicked', async () => {
    const addBtn = element.shadowRoot?.querySelector('button[title="Add Display"]');
    const menu = element.shadowRoot?.querySelector('#menu-display-types');
    
    expect(menu?.classList.contains('show')).toBe(false);
    
    addBtn?.dispatchEvent(new MouseEvent('click'));
    await element.updateComplete;
    
    expect(menu?.classList.contains('show')).toBe(true);
  });

  it('should dispatch select-item when an item is clicked in the content pane', async () => {
    // Add an item to active layout first
    element.activeLayout = {
        ...mockLayouts[0],
        items: [{ id: 'item1', display_type_id: 'dt1', x_mm: 10, y_mm: 10, orientation: 'landscape' }]
    };
    await element.updateComplete;

    const spy = vi.fn();
    element.addEventListener('select-item', spy);
    
    const card = element.shadowRoot?.querySelector('.layout-item-card');
    card?.dispatchEvent(new MouseEvent('click'));
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'item1' }
    }));
  });
});
