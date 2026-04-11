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
    file_hash: 'hash1'
  };

  beforeEach(async () => {
    element = document.createElement('image-dialog') as ImageDialog;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should initialize for adding new image', async () => {
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
  });
});
