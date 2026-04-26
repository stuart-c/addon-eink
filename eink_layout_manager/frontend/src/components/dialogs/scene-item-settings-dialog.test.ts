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

vi.mock('epdoptimize', () => ({
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
    images: [{ image_id: 'img1', scaling_factor: 100, offset: { x: 0, y: 0 }, background_color: '#ffffff' }]
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

    expect(element.shadowRoot?.querySelector('.adding-image') !== null).toBe(true);
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

  it('fits image correctly and centers it', async () => {
    const customDisplayTypes = [{ 
      id: 'dt1', 
      name: 'Custom', 
      width_px: 1000, height_px: 500,
      width_mm: 100, height_mm: 50,
      panel_width_mm: 100, panel_height_mm: 50,
      colour_type: 'BW'
    }];
    
    await element.show(mockItem, mockLayout as any, customDisplayTypes as any);
    await element.updateComplete;

    const fitBtn = element.shadowRoot?.querySelector('button[title="Fit to Panel"]') as HTMLButtonElement;
    fitBtn.click();
    await element.updateComplete;

    // Panel is 1000x500px
    // Image is 100x100px (from mock)
    // scaleW = 1000/100 = 10, scaleH = 500/100 = 5
    // Fit should take min scale = 5 -> 500%
    // Scaled size: 500x500
    // offsetX = (1000 - 500) / 2 = 250
    // offsetY = (500 - 500) / 2 = 0
    
    expect((element as any)._scalingFactor).toBe(500);
    expect((element as any)._offsetX).toBe(250);
    expect((element as any)._offsetY).toBe(0);
  });

  it('fills image correctly and centers it', async () => {
    const customDisplayTypes = [{ 
      id: 'dt1', 
      name: 'Custom', 
      width_px: 1000, height_px: 500,
      width_mm: 100, height_mm: 50,
      panel_width_mm: 100, panel_height_mm: 50,
      colour_type: 'BW'
    }];
    
    await element.show(mockItem, mockLayout as any, customDisplayTypes as any);
    await element.updateComplete;

    const fillBtn = element.shadowRoot?.querySelector('button[title="Fill Panel"]') as HTMLButtonElement;
    fillBtn.click();
    await element.updateComplete;

    // Panel is 1000x500px
    // Image is 100x100px
    // scaleW = 10, scaleH = 5
    // Fill should take max scale = 10 -> 1000%
    // Scaled size: 1000x1000
    // offsetX = (1000 - 1000) / 2 = 0
    // offsetY = (500 - 1000) / 2 = -250
    
    expect((element as any)._scalingFactor).toBe(1000);
    expect((element as any)._offsetX).toBe(0);
    expect((element as any)._offsetY).toBe(-250);
  });

  it('updates background color', async () => {
    await element.show(mockItem, mockLayout as any, mockDisplayTypes as any);
    await element.updateComplete;

    // Check default color
    expect((element as any)._backgroundColor).toBe('#ffffff');

    // Click Black swatch
    const blackBtn = element.shadowRoot?.querySelector('button[title="Black"]') as HTMLButtonElement;
    expect(blackBtn).toBeTruthy();
    blackBtn.click();
    await element.updateComplete;

    expect((element as any)._backgroundColor).toBe('#000000');
    expect((mockItem.images[0] as any).background_color).toBe('#000000');

    // Use custom color picker
    const colorInput = element.shadowRoot?.querySelector('input[type="color"]') as HTMLInputElement;
    expect(colorInput).toBeTruthy();
    colorInput.value = '#ff0000';
    colorInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect((element as any)._backgroundColor).toBe('#ff0000');
    expect((mockItem.images[0] as any).background_color).toBe('#ff0000');
  });
});
