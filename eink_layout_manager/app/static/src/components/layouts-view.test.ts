import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutsView } from './layouts-view';
import './layouts-view';
import { Layout, DisplayType } from '../services/HaApiClient';

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

  beforeEach(async () => {
    element = document.createElement('layouts-view') as LayoutsView;
    element.layouts = mockLayouts;
    element.displayTypes = mockDisplayTypes;
    element.activeLayout = mockLayouts[0];
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the side-bar and app-toolbar', () => {
    const sideBar = element.shadowRoot?.querySelector('side-bar');
    const toolbar = element.shadowRoot?.querySelector('app-toolbar');
    expect(sideBar).toBeTruthy();
    expect(toolbar).toBeTruthy();
  });

  it('should dispatch dirty-state-change when activeLayout changes', async () => {
    const spy = vi.fn();
    element.addEventListener('dirty-state-change', spy);
    
    element.activeLayout = { ...mockLayouts[0], name: 'Modified' };
    await element.updateComplete;
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ isDirty: true });
  });

  it('should dispatch save-layout when save is called', async () => {
    const spy = vi.fn();
    element.addEventListener('save-layout', spy);
    
    await element.save();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch update-active-layout with original data when discard is called', async () => {
    const originalName = mockLayouts[0].name;
    element.activeLayout = { ...mockLayouts[0], name: 'Modified' };
    await element.updateComplete;
    
    const spy = vi.fn();
    element.addEventListener('update-active-layout', spy);
    
    await element.discard();
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual(expect.objectContaining({ name: originalName }));
  });

  it('should dispatch delete-layout when requestDelete is called', async () => {
    const spy = vi.fn();
    element.addEventListener('delete-layout', spy);
    
    await element.requestDelete();
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { layout: mockLayouts[0] }
    }));
  });

  it('should dispatch update-active-layout when an item is added', async () => {
    const spy = vi.fn();
    element.addEventListener('update-active-layout', spy);
    
    const sideBar = element.shadowRoot?.querySelector('side-bar');
    sideBar?.dispatchEvent(new CustomEvent('add-item-to-layout', {
      detail: mockDisplayTypes[0]
    }));
    
    expect(spy).toHaveBeenCalled();
    const updates = spy.mock.calls[0][0].detail;
    expect(updates.items.length).toBe(1);
    expect(updates.items[0].display_type_id).toBe('dt1');
  });

  it('should dispatch select-item when an item is selected in editor', async () => {
    const spy = vi.fn();
    element.addEventListener('select-item', spy);
    
    const editor = element.shadowRoot?.querySelector('layout-editor');
    editor?.dispatchEvent(new CustomEvent('select-item', {
      detail: { id: 'item1' }
    }));
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'item1' }
    }));
  });
});
