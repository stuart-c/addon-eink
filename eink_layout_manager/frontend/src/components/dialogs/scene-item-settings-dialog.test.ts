import { describe, it, expect, vi, beforeEach } from 'vitest';
import './scene-item-settings-dialog';
import { SceneItemSettingsDialog } from './scene-item-settings-dialog';

// Mock the API and epdoptimize
vi.mock('../../services/HaApiClient', async () => {
    const actual = await vi.importActual('../../services/HaApiClient');
    return {
        ...actual as any,
        api: {
            getImages: vi.fn().mockResolvedValue([
                { 
                    id: 'img1', 
                    name: 'Test Image', 
                    dimensions: { width: 100, height: 100 },
                    conversion: { ditheringType: 'none' }
                }
            ])
        }
    };
});

vi.mock('../../lib/epdoptimize/index', () => ({
    ditherImage: vi.fn().mockResolvedValue(undefined),
    getDefaultPalettes: vi.fn().mockReturnValue(['#000', '#fff'])
}));

describe('SceneItemSettingsDialog', () => {
  let element: SceneItemSettingsDialog;
  const mockDisplayTypes = [{ 
    id: 'dt1', 
    name: '7.5in', 
    width_px: 800, height_px: 480,
    width_mm: 160, height_mm: 100,
    colour_type: 'BW'
  }];
  const mockLayout = {
    id: 'l1',
    items: [{ id: 'd1', display_type_id: 'dt1', x_mm: 0, y_mm: 0, orientation: 'landscape' }]
  };
  const mockItem = {
    id: 'si1',
    displays: ['d1'],
    images: [{ image_id: 'img1', scaling_factor: 100, offset: { x: 0, y: 0 } }]
  };

  beforeEach(async () => {
    element = document.createElement('scene-item-settings-dialog') as SceneItemSettingsDialog;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  it('populates initial image items', async () => {
    await element.show(mockItem, mockLayout as any, mockDisplayTypes as any);
    await element.updateComplete;

    const imageItems = element.shadowRoot?.querySelectorAll('.image-item');
    expect(imageItems?.length).toBe(1);
    expect(imageItems?.[0].textContent).toContain('Test Image');
  });

  it('allows switching to image library to add images', async () => {
    await element.show(mockItem, mockLayout as any, mockDisplayTypes as any);
    await element.updateComplete;

    const addBtn = element.shadowRoot?.querySelector('button[title="Add Image"]') as HTMLButtonElement;
    addBtn.click();
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.adding-image')).not.toBeNull();
    const imageCards = element.shadowRoot?.querySelectorAll('.image-card');
    expect(imageCards?.length).toBe(1);
  });

  it('removes an image when delete button is clicked', async () => {
    // We must clone because the dialog modifies the item in place
    const item = JSON.parse(JSON.stringify(mockItem));
    await element.show(item, mockLayout as any, mockDisplayTypes as any);
    await element.updateComplete;

    expect((element as any)._selectedImageId).toBe('img1');

    const deleteBtn = element.shadowRoot?.querySelector('button[title="Delete Image"]') as HTMLButtonElement;
    expect(deleteBtn !== null).toBe(true);
    expect(deleteBtn.disabled).toBe(false);
    
    deleteBtn.click();
    await element.updateComplete;

    expect(element.item.images.length).toBe(0);
    expect(element.shadowRoot?.querySelectorAll('.image-item').length).toBe(0);
  });

  it('updates scaling factor', async () => {
    await element.show(mockItem, mockLayout as any, mockDisplayTypes as any);
    await element.updateComplete;

    const rangeInput = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
    rangeInput.value = '150';
    rangeInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect((element as any)._scalingFactor).toBe(150);
    expect(element.item.images[0].scaling_factor).toBe(150);
  });
});
