import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './display-types-view';
import { DisplayTypesView } from './display-types-view';
import '../shared/sidebar-list';

describe('DisplayTypesView', () => {
  let element: DisplayTypesView;
  const mockDisplayTypes = [
    {
      id: 'dt1',
      name: 'Display 1',
      width_mm: 200,
      height_mm: 150,
      panel_width_mm: 180,
      panel_height_mm: 130,
      width_px: 800,
      height_px: 600,
      colour_type: 'MONO',
      frame: { border_width_mm: 10, colour: '#000000' },
      mat: { colour: '#ffffff' }
    },
    {
      id: 'dt2',
      name: 'Display 2',
      width_mm: 100,
      height_mm: 100,
      panel_width_mm: 80,
      panel_height_mm: 80,
      width_px: 400,
      height_px: 400,
      colour_type: 'BWR',
      frame: { border_width_mm: 5, colour: '#ffffff' },
      mat: { colour: '#eeeeee' }
    }
  ];

  beforeEach(async () => {
    element = document.createElement('display-types-view') as DisplayTypesView;
    element.displayTypes = mockDisplayTypes as any;
    // Explicitly set to the first one to avoid auto-pick logic interference for tests that don't want it
    element.selectedId = 'dt1';
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should initialise with the first display type selected', () => {
    expect(element.displayType?.id).toBe('dt1');
    expect(element.isNew).toBe(false);
  });

  it('should be blank when nothing is selected and not adding', async () => {
    element.selectedId = null;
    element.isAdding = false;
    await element.updateComplete;
    
    expect(element.displayType).toBeUndefined();
    
    const toolbarTitle = element.shadowRoot?.querySelector('.toolbar-title');
    expect(toolbarTitle?.textContent?.trim()).toBe('Display Types');

    const emptyView = element.shadowRoot?.querySelector('empty-view');
    expect(emptyView).toBeTruthy();
  });

  it('should dispatch select-display-type when another display type is clicked in sidebar', async () => {
    const selectSpy = vi.fn();
    element.addEventListener('select-display-type', selectSpy);

    const sidebarList = element.shadowRoot?.querySelector('sidebar-list');
    const items = sidebarList?.shadowRoot?.querySelectorAll('.sidebar-item');
    // Index 1 is the 2nd display type (Index 0 is the 1st)
    (items?.[1] as HTMLElement).click();
    
    expect(selectSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: 'dt2' }
    }));
  });

  it('should dispatch select-display-type with null when addNew is called', async () => {
    const selectSpy = vi.fn();
    element.addEventListener('select-display-type', selectSpy);

    element.addNew();
    
    expect(selectSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { id: null }
    }));
  });

  it('should detect dirty state when fields are modified', async () => {
    expect(element.isDirty).toBe(false);
    
    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = 'Changed name';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    await element.updateComplete;
    expect(element.isDirty).toBe(true);
  });

  it('should emit save event when form is submitted', async () => {
    const saveSpy = vi.fn();
    element.addEventListener('save', saveSpy);
    
    // Fill in a name for a new device
    element.selectedId = null;
    element.isAdding = true;
    await element.updateComplete;
    
    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = 'New Device';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Manually trigger submit
    (element as any)._handleSubmit(new Event('submit'));
    
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        displayType: expect.objectContaining({ name: 'New Device' })
      })
    }));
  });

  it('should calculate correct dimensions for summary table', async () => {
    // Current display type is dt1: width=200, height=150, border=10
    // matW = 200 - 2*10 = 180
    // matH = 150 - 2*10 = 130
    
    const rows = element.shadowRoot?.querySelectorAll('.summary-table tr');
    const matRow = rows?.[1]; // Mat (Aperture)
    expect(matRow?.textContent).toContain('180 x 130');
  });
});
