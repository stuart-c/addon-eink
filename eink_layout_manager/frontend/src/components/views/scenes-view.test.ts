import { describe, it, expect, vi, beforeEach } from 'vitest';
import './scenes-view';
import { ScenesView } from './scenes-view';

describe('ScenesView', () => {
  let element: ScenesView;
  const mockScene = {
    id: 'scene1',
    name: 'Test Scene',
    layout: 'layout1',
    items: [
      { id: 'item1', type: 'image' as const, displays: ['d1'], images: [] },
      { id: 'item2', type: 'tile' as const, displays: ['d1', 'd2'], images: [] }
    ]
  };
  const mockLayout = {
    id: 'layout1',
    name: 'Main Layout',
    canvas_width_mm: 200,
    canvas_height_mm: 150,
    items: [{ id: 'd1', display_type_id: 'dt1' }, { id: 'd2', display_type_id: 'dt1' }]
  };
  const mockState = {
    scenes: [mockScene],
    activeScene: mockScene,
    layouts: [mockLayout],
    displayTypes: [{ id: 'dt1', name: '7.5in' }],
    updateScene: vi.fn(),
    showMessage: vi.fn()
  };

  beforeEach(async () => {
    element = document.createElement('scenes-view') as ScenesView;
    element.state = mockState;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  it('renders scene items in the content list', () => {
    const items = element.shadowRoot?.querySelectorAll('.placeholder-item');
    expect(items?.length).toBe(2);
    expect(items?.[0].textContent).toContain('Scene Item #1');
    expect(items?.[1].textContent).toContain('Scene Item #2');
  });

  it('selects an item when clicked', async () => {
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    
    expect(item.classList.contains('selected')).toBe(true);
    expect((element as any)._selectedItemId).toBe('item1');
  });

  it('opens the settings dialog on double-click', async () => {
    const dialog = element.shadowRoot?.querySelector('scene-item-settings-dialog');
    const showSpy = vi.spyOn(dialog as any, 'show');
    
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.dispatchEvent(new MouseEvent('dblclick'));
    await element.updateComplete;
    
    expect(showSpy).toHaveBeenCalledWith(mockScene.items[0]);
  });

  it('opens the settings dialog via the toolbar button', async () => {
    const dialog = element.shadowRoot?.querySelector('scene-item-settings-dialog');
    const showSpy = vi.spyOn(dialog as any, 'show');
    
    // Select the item first
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    
    // Find the edit button
    const editBtn = element.shadowRoot?.querySelector('button[title="Edit Item"]') as HTMLButtonElement;
    expect(editBtn.disabled).toBe(false);
    editBtn.click();
    
    expect(showSpy).toHaveBeenCalledWith(mockScene.items[0]);
  });

  it('disables edit button when no item is selected', async () => {
    const editBtn = element.shadowRoot?.querySelector('button[title="Edit Item"]') as HTMLButtonElement;
    expect(editBtn.disabled).toBe(true);
  });

  it('resets selection when active scene changes', async () => {
    // Select an item
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    expect((element as any)._selectedItemId).toBe('item1');

    // Change active scene
    element.activeScene = { ...mockScene, id: 'scene2' };
    await element.updateComplete;

    expect((element as any)._selectedItemId).toBeNull();
  });

  it('disables delete button when no item is selected', async () => {
    const deleteBtn = element.shadowRoot?.querySelector('button[title="Delete Item"]') as HTMLButtonElement;
    expect(deleteBtn.disabled).toBe(true);
  });

  it('enables delete button when an item is selected', async () => {
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    
    const deleteBtn = element.shadowRoot?.querySelector('button[title="Delete Item"]') as HTMLButtonElement;
    expect(deleteBtn.disabled).toBe(false);
  });

  it('emits request-confirmation when delete button is clicked', async () => {
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    
    const confirmSpy = vi.fn();
    element.addEventListener('request-confirmation', confirmSpy);
    
    const deleteBtn = element.shadowRoot?.querySelector('button[title="Delete Item"]') as HTMLButtonElement;
    deleteBtn.click();
    
    expect(confirmSpy).toHaveBeenCalled();
    const event = confirmSpy.mock.calls[0][0];
    expect(event.detail.config.title).toBe('Delete Scene Item?');
  });

  it('updates scene and clears selection when confirmation result is true', async () => {
    const item = element.shadowRoot?.querySelector('.placeholder-item') as HTMLElement;
    item.click();
    await element.updateComplete;
    
    let confirmCallback: (confirmed: boolean) => void = () => {};
    element.addEventListener('request-confirmation', (e: any) => {
      confirmCallback = e.detail.callback;
    });
    
    const deleteBtn = element.shadowRoot?.querySelector('button[title="Delete Item"]') as HTMLButtonElement;
    deleteBtn.click();
    
    await confirmCallback(true);
    
    expect(mockState.updateScene).toHaveBeenCalledWith('scene1', {
      items: [mockScene.items[1]]
    });
    expect((element as any)._selectedItemId).toBeNull();
  });
});
