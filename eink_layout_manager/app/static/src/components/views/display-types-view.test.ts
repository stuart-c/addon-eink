import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import './components/views/display-types-view';
import { DisplayTypesView } from './components/views/display-types-view';

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
    element = await fixture(html`
      <display-types-view 
        .displayTypes="${mockDisplayTypes}"
      ></display-types-view>
    `);
  });

  it('should initialize with the first display type selected', () => {
    expect(element.displayType?.id).toBe('dt1');
    expect(element.isNew).toBe(false);
  });

  it('should switch to another display type when clicked in sidebar', async () => {
    const items = element.shadowRoot?.querySelectorAll('.sidebar-item');
    // Index 1 is the 2nd display type (Index 0 is the 1st)
    (items?.[1] as HTMLElement).click();
    
    await element.updateComplete;
    expect(element.displayType?.id).toBe('dt2');
  });

  it('should go into "Add New" mode when addNew is called', async () => {
    element.addNew();
    await element.updateComplete;
    
    expect(element.isNew).toBe(true);
    expect(element.displayType?.id).toBe('');
    expect(element.displayType?.name).toBe('');
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
    element.addNew();
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
