import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AppToolbar } from './app-toolbar';
import './app-toolbar';

describe('AppToolbar', () => {
  let element: AppToolbar;
  const mockLayouts = [
    { id: 'l1', name: 'Layout 1', canvas_width_mm: 100, canvas_height_mm: 100, items: [] },
    { id: 'l2', name: 'Layout 2', canvas_width_mm: 200, canvas_height_mm: 150, items: [] }
  ];

  beforeEach(async () => {
    element = document.createElement('app-toolbar');
    element.layouts = mockLayouts as any;
    element.activeLayout = mockLayouts[0] as any;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should display the active layout name', () => {
    const trigger = element.shadowRoot?.querySelector('#trigger-layouts span');
    expect(trigger?.textContent).toBe('Layout 1');
  });

  it('should show the dropdown menu when clicked', async () => {
    const trigger = element.shadowRoot?.querySelector('#trigger-layouts') as HTMLElement;
    trigger.click();
    await element.updateComplete;

    const menu = element.shadowRoot?.querySelector('#menu-layouts');
    expect(menu?.classList.contains('show')).toBe(true);
  });

  it('should dispatch switch-layout event when an item is clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('switch-layout', spy);

    // Open menu
    const trigger = element.shadowRoot?.querySelector('#trigger-layouts') as HTMLElement;
    trigger.click();
    await element.updateComplete;

    // Click second layout
    const items = element.shadowRoot?.querySelectorAll('.dropdown-item');
    (items?.[1] as HTMLElement).click();

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual(mockLayouts[1]);
  });

  it('should display mouse coordinates when provided', async () => {
    element.mousePos = { x: 50, y: 75 };
    await element.updateComplete;

    const mouseInfo = element.shadowRoot?.querySelector('.pos-value');
    expect(mouseInfo?.textContent).toContain('X: 50mm, Y: 75mm');
  });

  it('should dispatch edit-layout event when settings button is clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('edit-layout', spy);

    const button = element.shadowRoot?.querySelector('#btn-layout-settings') as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should display canvas dimensions', () => {
    const canvasDim = element.shadowRoot?.querySelector('.canvas-dim');
    expect(canvasDim?.textContent).toContain('Canvas: 100x100mm');
  });
});
