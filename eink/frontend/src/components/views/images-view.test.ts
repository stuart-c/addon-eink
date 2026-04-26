import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImagesView } from './images-view';
import './images-view';
import { Image } from '../../services/HaApiClient';
import '../shared/keyword-input';

// Mock the API
vi.mock('../../services/HaApiClient', () => {
  return {
    api: {
      getKeywords: vi.fn().mockResolvedValue([]),
    },
  };
});

describe('ImagesView', () => {
  let element: ImagesView;

  const mockImages: Image[] = [
    {
      id: 'img1',
      name: 'Test Image 1',
      file_type: 'PNG',
      dimensions: { width: 100, height: 100 },
      file_path: '/data/image/img1.png',
      file_hash: 'hash1'
    },
    {
      id: 'img2',
      name: 'Test Image 2',
      file_type: 'JPG',
      dimensions: { width: 200, height: 150 },
      file_path: '/data/image/img2.jpg',
      file_hash: 'hash2'
    }
  ];

  beforeEach(async () => {
    element = document.createElement('images-view') as ImagesView;
    element.images = mockImages;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the image grid when images are present', () => {
    const grid = element.shadowRoot?.querySelector('.image-grid');
    const cards = element.shadowRoot?.querySelectorAll('.image-card');
    
    expect(grid).toBeTruthy();
    expect(cards?.length).toBe(2);
  });

  it('should render an empty view when no images are present', async () => {
    element.images = [];
    await element.updateComplete;
    
    const emptyView = element.shadowRoot?.querySelector('empty-view');
    const grid = element.shadowRoot?.querySelector('.image-grid');
    
    expect(emptyView).toBeTruthy();
    expect(grid).toBeFalsy();
  });

  it('should display image names and dimensions', () => {
    const names = Array.from(element.shadowRoot?.querySelectorAll('.image-name') || [])
      .map(el => el.textContent?.trim());
    const metas = Array.from(element.shadowRoot?.querySelectorAll('.image-meta') || [])
      .map(el => el.textContent?.trim());
    
    expect(names).toContain('Test Image 1');
    expect(names).toContain('Test Image 2');
    expect(metas[0]).toContain('100 × 100');
    expect(metas[1]).toContain('200 × 150');
  });

  it('should dispatch image-click event when a card is clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('image-click', spy);
    
    const firstCard = element.shadowRoot?.querySelector('.image-card') as HTMLElement;
    firstCard?.click();
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ image: mockImages[0] });
  });

  it('should apply selected class to the correct card', async () => {
    element.selectedImageId = 'img1';
    await element.updateComplete;
    
    const firstCard = element.shadowRoot?.querySelectorAll('.image-card')[0];
    const secondCard = element.shadowRoot?.querySelectorAll('.image-card')[1];
    
    expect(firstCard?.classList.contains('selected')).toBe(true);
    expect(secondCard?.classList.contains('selected')).toBe(false);
  });

  it('should dispatch edit-image event when a card is double-clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('edit-image', spy);
    
    const firstCard = element.shadowRoot?.querySelector('.image-card') as HTMLElement;
    firstCard?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, composed: true }));
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ image: mockImages[0] });
  });

  it('should dispatch edit-image event when the settings icon is clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('edit-image', spy);
    
    const settingsIcon = element.shadowRoot?.querySelector('.action-icon') as HTMLElement;
    settingsIcon?.click();
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ image: mockImages[0] });
  });

  it('should provide canDelete based on selection', async () => {
    expect(element.canDelete).toBe(false);
    
    element.selectedImageId = 'img1';
    await element.updateComplete;
    expect(element.canDelete).toBe(true);
  });

  it('should dispatch delete-image when requestDelete is called', () => {
    const spy = vi.fn();
    element.addEventListener('delete-image', spy);
    
    element.selectedImageId = 'img1';
    element.requestDelete();
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ image: mockImages[0] });
  });

  it('should render range sliders for dimensions', () => {
    const sliders = element.shadowRoot?.querySelectorAll('range-slider');
    expect(sliders?.length).toBe(2);
    expect(Array.from(sliders || []).map(s => (s as any).label)).toContain('Width');
    expect(Array.from(sliders || []).map(s => (s as any).label)).toContain('Height');
  });

  it('should render detailed search inputs', () => {
    const inputs = element.shadowRoot?.querySelectorAll('input[type="text"]');
    const placeholders = Array.from(inputs || []).map(i => (i as HTMLInputElement).placeholder);
    
    expect(placeholders).toContain('Search by title...');
    expect(placeholders).toContain('Search description...');
    expect(placeholders).toContain('Artist');
    expect(placeholders).toContain('Collection');
  });

  it('should render sort priority section', () => {
    const title = Array.from(element.shadowRoot?.querySelectorAll('.sidebar-section-title') || [])
      .find(el => el.textContent?.includes('Sort Priority'));
    expect(title).toBeTruthy();
    
    const sortItems = element.shadowRoot?.querySelectorAll('.sort-item');
    expect(sortItems?.length).toBe(1);
    expect(sortItems?.[0].textContent).toContain('Name');
  });

  it('should add a sort field from the menu', async () => {
    // Open menu
    const addButton = element.shadowRoot?.querySelector('.add-sort-button') as HTMLElement;
    addButton.click();
    await element.updateComplete;

    const menuItems = element.shadowRoot?.querySelectorAll('.add-sort-item');
    expect(menuItems?.length).toBe(4); // 5 total - 1 active (Name)

    // Click Artist
    const artistItem = Array.from(menuItems || []).find(i => i.textContent?.trim() === 'Artist') as HTMLElement;
    artistItem.click();
    await element.updateComplete;

    const sortItems = element.shadowRoot?.querySelectorAll('.sort-item');
    expect(sortItems?.length).toBe(2);
    expect(sortItems?.[1].textContent).toContain('Artist');
  });

  it('should remove a sort field', async () => {
    // Initial: Name
    const removeButton = element.shadowRoot?.querySelector('.sort-action.remove') as HTMLElement;
    removeButton.click();
    await element.updateComplete;

    const sortItems = element.shadowRoot?.querySelectorAll('.sort-item');
    expect(sortItems?.length).toBe(0);
  });

  it('should toggle sort direction', async () => {
    const toggleButton = element.shadowRoot?.querySelector('.sort-action') as HTMLElement;
    const icon = toggleButton.querySelector('.material-icons');
    
    expect(icon?.textContent?.trim()).toBe('north'); // asc

    toggleButton.click();
    await element.updateComplete;
    
    expect(icon?.textContent?.trim()).toBe('south'); // desc
  });
});
