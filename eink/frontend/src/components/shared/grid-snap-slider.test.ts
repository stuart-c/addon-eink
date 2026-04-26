import { describe, it, expect, vi, beforeEach } from 'vitest';
import './grid-snap-slider';
import { GridSnapSlider } from './grid-snap-slider';

describe('GridSnapSlider', () => {
  let element: GridSnapSlider;

  beforeEach(async () => {
    element = document.createElement('grid-snap-slider') as GridSnapSlider;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  it('renders initial value', () => {
    expect(element.value).toBe(5);
    const labels = element.shadowRoot?.querySelectorAll('.label-item');
    expect(labels?.[1].classList.contains('active')).toBe(true);
    expect(labels?.[1].textContent?.trim()).toBe('5mm');
  });

  it('changes value when clicking a label', async () => {
    const labels = element.shadowRoot?.querySelectorAll('.label-item');
    const label20 = labels?.[3] as HTMLElement;
    
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);
    
    label20.click();
    await element.updateComplete;
    
    expect(element.value).toBe(20);
    expect(label20.classList.contains('active')).toBe(true);
    expect(changeSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { value: 20 }
    }));
  });

  it('changes value via slider input', async () => {
    const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
    
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);
    
    // Set to index 2 (10mm)
    input.value = '2';
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;
    
    expect(element.value).toBe(10);
    const labels = element.shadowRoot?.querySelectorAll('.label-item');
    expect(labels?.[2].classList.contains('active')).toBe(true);
    expect(changeSpy).toHaveBeenCalled();
  });
});
