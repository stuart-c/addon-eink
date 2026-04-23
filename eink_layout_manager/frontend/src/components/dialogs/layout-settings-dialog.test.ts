import { describe, it, expect, vi, beforeEach } from 'vitest';
import './layout-settings-dialog';
import { LayoutSettingsDialog } from './layout-settings-dialog';
import { Layout } from '../../services/HaApiClient';

describe('LayoutSettingsDialog', () => {
  let element: LayoutSettingsDialog;
  const mockLayout: Layout = {
    id: 'l1',
    name: 'My Layout',
    canvas_width_mm: 400,
    canvas_height_mm: 300,
    grid_snap_mm: 10,
    items: []
  };

  beforeEach(async () => {
    element = document.createElement('layout-settings-dialog') as LayoutSettingsDialog;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  it('populates fields when shown', async () => {
    await element.show(mockLayout);
    await element.updateComplete;

    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    const widthInput = element.shadowRoot?.querySelectorAll('input[type="number"]')[0] as HTMLInputElement;
    const heightInput = element.shadowRoot?.querySelectorAll('input[type="number"]')[1] as HTMLInputElement;

    expect(nameInput.value).toBe('My Layout');
    expect(widthInput.value).toBe('400');
    expect(heightInput.value).toBe('300');
  });

  it('dispatches save event with updated data', async () => {
    await element.show(mockLayout);
    await element.updateComplete;

    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = 'Updated Name';
    nameInput.dispatchEvent(new Event('input'));

    const saveSpy = vi.fn();
    element.addEventListener('save', saveSpy);

    const saveBtn = element.shadowRoot?.querySelector('.primary') as HTMLButtonElement;
    saveBtn.click();

    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        settings: expect.objectContaining({
          name: 'Updated Name'
        })
      })
    }));
  });
});
