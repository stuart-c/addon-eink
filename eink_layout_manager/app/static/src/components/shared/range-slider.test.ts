import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RangeSlider } from './range-slider';
import './range-slider';

describe('RangeSlider', () => {
  let element: RangeSlider;

  beforeEach(async () => {
    element = document.createElement('range-slider') as RangeSlider;
    element.min = 0;
    element.max = 1000;
    element.valueLow = 200;
    element.valueHigh = 800;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the low and high inputs', () => {
    const lowInput = element.shadowRoot?.querySelector('#low') as HTMLInputElement;
    const highInput = element.shadowRoot?.querySelector('#high') as HTMLInputElement;
    
    expect(lowInput).toBeTruthy();
    expect(highInput).toBeTruthy();
    expect(lowInput.value).toBe('200');
    expect(highInput.value).toBe('800');
  });

  it('should update values when inputs change', async () => {
    const lowInput = element.shadowRoot?.querySelector('#low') as HTMLInputElement;
    const spy = vi.fn();
    element.addEventListener('range-change', spy);

    lowInput.value = '300';
    lowInput.dispatchEvent(new Event('input'));
    
    expect(element.valueLow).toBe(300);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ low: 300, high: 800 });
  });

  it('should prevent low value from exceeding high value', async () => {
    const lowInput = element.shadowRoot?.querySelector('#low') as HTMLInputElement;
    
    lowInput.value = '900';
    lowInput.dispatchEvent(new Event('input'));
    
    expect(element.valueLow).toBe(799); // high - 1
    expect(parseInt(lowInput.value)).toBe(799);
  });

  it('should prevent high value from going below low value', async () => {
    const highInput = element.shadowRoot?.querySelector('#high') as HTMLInputElement;
    
    highInput.value = '100';
    highInput.dispatchEvent(new Event('input'));
    
    expect(element.valueHigh).toBe(201); // low + 1
    expect(parseInt(highInput.value)).toBe(201);
  });

  it('should render the active track with correct width and position', () => {
    const track = element.shadowRoot?.querySelector('.active-track') as HTMLElement;
    
    // low=200, high=800, min=0, max=1000 => 20% to 80%
    expect(track.style.left).toBe('20%');
    expect(track.style.width).toBe('60%');
  });
});
