import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImageDialog } from './image-dialog';
import './image-dialog';
import { api, Image } from '../../services/HaApiClient';

vi.mock('../../services/HaApiClient', () => ({
  api: {
    uploadImage: vi.fn(),
    updateImage: vi.fn(),
    deleteItem: vi.fn(),
    getKeywords: vi.fn().mockResolvedValue([]),
  },
}));

describe('ImageDialog', () => {
  let element: ImageDialog;

  const mockImage: Image = {
    id: 'img1',
    name: 'Existing Image',
    artist: 'Test Artist',
    collection: 'Test Collection',
    description: 'Test Description',
    keywords: ['test', 'unit'],
    file_type: 'PNG',
    dimensions: { width: 800, height: 600 },
    colour_depth: 8,
    file_path: '/path/to/img1.png',
    file_hash: 'hash1',
    brightness: 1.2,
    contrast: 0.8,
    saturation: 1.0,
    conversion: {
      ditheringType: 'errorDiffusion',
      errorDiffusionMatrix: 'floydSteinberg',
      serpentine: true,
      processingPreset: ''
    }
  };


  beforeEach(async () => {
    element = document.createElement('image-dialog') as ImageDialog;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should initialise for adding new image', async () => {
    await element.show();
    await element.updateComplete;
    
    const baseDialog = element.shadowRoot?.querySelector('base-dialog') as any;
    expect(baseDialog.title).toBe('Add New Image');
    
    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    expect(nameInput.value).toBe('');
  });

  it('should populate fields when editing an image', async () => {
    await element.show(mockImage);
    await element.updateComplete;
    
    const baseDialog = element.shadowRoot?.querySelector('base-dialog') as any;
    expect(baseDialog.title).toBe('Edit Image');
    
    const inputs = element.shadowRoot?.querySelectorAll('input[type="text"]');
    expect((inputs?.[0] as HTMLInputElement).value).toBe('Existing Image');
    expect((inputs?.[1] as HTMLInputElement).value).toBe('Test Artist');
    expect((inputs?.[2] as HTMLInputElement).value).toBe('Test Collection');
    
    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea?.value).toBe('Test Description');
  });

  it('should disable upload interactions in edit mode', async () => {
    await element.show(mockImage);
    await element.updateComplete;
    
    const uploadSection = element.shadowRoot?.querySelector('.upload-section') as HTMLElement;
    expect(uploadSection.style.cursor).toBe('default');
    
    // Check if input[type="file"] is absent
    const fileInput = element.shadowRoot?.querySelector('input[type="file"]');
    expect(fileInput).toBeFalsy();
  });

  it('should call updateImage with correct metadata on save when editing', async () => {
    await element.show(mockImage);
    await element.updateComplete;
    
    // Change a field
    const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
    nameInput.value = 'Updated Name';
    nameInput.dispatchEvent(new Event('input'));
    
    vi.mocked(api.updateImage).mockResolvedValue({ ...mockImage, name: 'Updated Name' });
    
    const saveBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
      .find(b => b.textContent?.trim().includes('Update Image')) as HTMLButtonElement;
    
    await saveBtn.click();
    
    expect(api.updateImage).toHaveBeenCalledWith('img1', expect.objectContaining({
      name: 'Updated Name',
      artist: 'Test Artist'
    }));

    // Verify palette was NOT in the conversion object
    const updateCall = vi.mocked(api.updateImage).mock.calls[0];
    const updatePayload = updateCall[1] as any;
    expect(updatePayload.conversion.palette).toBeUndefined();
  });

  it('should show palette dropdown and default to Spectra 6', async () => {
    await element.show();
    await element.updateComplete;

    const paletteSelect = element.shadowRoot?.querySelector('.preview-controls select') as HTMLSelectElement;
    expect(paletteSelect).toBeTruthy();
    expect(paletteSelect.value).toBe('aitjcizeSpectra6Palette');
  });


  it('should not call deleteItem when cancelling in edit mode', async () => {
    await element.show(mockImage);
    await element.updateComplete;

    const cancelBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
      .find(b => b.textContent?.trim() === 'Cancel') as HTMLButtonElement;

    await cancelBtn.click();

    expect(api.deleteItem).toHaveBeenCalledTimes(0);
  });

  it('should call deleteItem when cancelling after uploading a new image', async () => {
    await element.show();
    await element.updateComplete;

    // Simulate an upload by manually setting the private state
    const uploadedImage: Image = { ...mockImage, id: 'new-img' };
    (element as any)._uploadedImage = uploadedImage;
    await element.updateComplete;

    const cancelBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
      .find(b => b.textContent?.trim() === 'Cancel') as HTMLButtonElement;

    await cancelBtn.click();

    expect(api.deleteItem).toHaveBeenCalledWith('image', 'new-img');
  });

  describe('Accordion Logic', () => {
    it('should have Details open and Properties closed by default', async () => {
      await element.show();
      await element.updateComplete;

      const detailsSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1)');
      const propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');

      expect(detailsSection?.classList.contains('open')).toBe(true);
      expect(propertiesSection?.classList.contains('open')).toBe(false);
    });

    it('should close Details and open Properties when Details header is clicked while open', async () => {
      await element.show();
      await element.updateComplete;

      const detailsHeader = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1) .accordion-header') as HTMLElement;
      detailsHeader.click();
      await element.updateComplete;

      const detailsSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1)');
      const propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');

      expect(detailsSection?.classList.contains('open')).toBe(false);
      expect(propertiesSection?.classList.contains('open')).toBe(true);
    });

    it('should open Details and close Properties when Details header is clicked while closed', async () => {
      await element.show();
      await element.updateComplete;

      // Close Details first
      const detailsHeader = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1) .accordion-header') as HTMLElement;
      detailsHeader.click();
      await element.updateComplete;

      // Click Details header again to open it
      detailsHeader.click();
      await element.updateComplete;

      const detailsSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1)');
      const propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');

      expect(detailsSection?.classList.contains('open')).toBe(true);
      expect(propertiesSection?.classList.contains('open')).toBe(false);
    });

    it('should close Properties and open Details when Properties header is clicked while open', async () => {
      await element.show();
      await element.updateComplete;

      // Open Properties first
      const detailsHeader = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1) .accordion-header') as HTMLElement;
      detailsHeader.click();
      await element.updateComplete;

      // Now Details is closed, Properties is open. Click Properties header.
      const propertiesHeader = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2) .accordion-header') as HTMLElement;
      propertiesHeader.click();
      await element.updateComplete;

      const detailsSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1)');
      const propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');

      expect(detailsSection?.classList.contains('open')).toBe(true);
      expect(propertiesSection?.classList.contains('open')).toBe(false);
    });

    it('should reset accordion state when show() is called', async () => {
      await element.show();
      await element.updateComplete;

      // Toggle to Properties open
      const detailsHeader = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1) .accordion-header') as HTMLElement;
      detailsHeader.click();
      await element.updateComplete;

      let propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');
      expect(propertiesSection?.classList.contains('open')).toBe(true);

      // Call show() again
      await element.show();
      await element.updateComplete;

      const detailsSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(1)');
      propertiesSection = element.shadowRoot?.querySelector('.accordion-item:nth-of-type(2)');

      expect(detailsSection?.classList.contains('open')).toBe(true);
      expect(propertiesSection?.classList.contains('open')).toBe(false);
    });
  });

  describe('Delete Logic', () => {
    it('should not show delete button in add mode', async () => {
      await element.show();
      await element.updateComplete;

      const deleteBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
        .find(b => b.textContent?.trim().includes('Delete'));
      
      expect(deleteBtn).toBeFalsy();
    });

    it('should show delete button in edit mode', async () => {
      await element.show(mockImage);
      await element.updateComplete;

      const deleteBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
        .find(b => b.textContent?.trim().includes('Delete')) as HTMLButtonElement;
      
      expect(deleteBtn).toBeTruthy();
      expect(deleteBtn.classList.contains('danger')).toBe(true);
    });

    it('should dispatch delete event when delete button is clicked', async () => {
      await element.show(mockImage);
      await element.updateComplete;

      const deleteBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
        .find(b => b.textContent?.trim().includes('Delete')) as HTMLButtonElement;
      
      const deleteListener = vi.fn();
      element.addEventListener('delete', deleteListener);

      await deleteBtn.click();

      expect(deleteListener).toHaveBeenCalled();
      const event = deleteListener.mock.calls[0][0];
      expect(event.detail.image.id).toBe(mockImage.id);
    });
  });
});
