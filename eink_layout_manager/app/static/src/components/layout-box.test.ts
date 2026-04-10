import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LayoutBox } from './layout-box';
import './layout-box';

describe('LayoutBox', () => {
  let element: LayoutBox;

  beforeEach(async () => {
    element = document.createElement('layout-box');
    element.x = 10;
    element.y = 20;
    element.width = 100;
    element.height = 80;
    element.name = 'Test Display';
    element.itemIndex = 1;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should apply transform based on x and y', () => {
    expect(element.style.transform).toBe('translate(10px, 20px)');
  });

  it('should apply dimensions', () => {
    expect(element.style.width).toBe('100px');
    expect(element.style.height).toBe('80px');
  });

  it('should swap dimensions when rotated 90 degrees', async () => {
    element.orientation = 90;
    await element.updateComplete;
    
    expect(element.style.width).toBe('80px');
    expect(element.style.height).toBe('100px');
  });

  it('should display the name and index', () => {
    const label = element.shadowRoot?.querySelector('.label');
    expect(label?.textContent).toContain('Test Display');
    
    const number = element.shadowRoot?.querySelector('.item-number');
    expect(number?.textContent?.trim()).toBe('1');
  });

  it('should show overlap message when invalid', async () => {
    element.invalid = true;
    await element.updateComplete;
    
    const label = element.shadowRoot?.querySelector('.label');
    expect(label?.textContent).toContain('(Overlap!)');
  });

  it('should dispatch item-edit event', async () => {
    const spy = vi.fn();
    element.addEventListener('item-edit', spy);
    
    const btn = element.shadowRoot?.querySelector('.action-btn[title="Settings"]') as HTMLElement;
    btn.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch item-rotate event', async () => {
    const spy = vi.fn();
    element.addEventListener('item-rotate', spy);
    
    const btn = element.shadowRoot?.querySelector('.action-btn[title="Rotate"]') as HTMLElement;
    btn.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch item-delete event', async () => {
    const spy = vi.fn();
    element.addEventListener('item-delete', spy);
    
    const btn = element.shadowRoot?.querySelector('.action-btn.delete') as HTMLElement;
    btn.click();
    
    expect(spy).toHaveBeenCalled();
  });
});
