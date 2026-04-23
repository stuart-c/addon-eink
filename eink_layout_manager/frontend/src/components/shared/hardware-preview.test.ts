import { describe, it, expect, beforeEach } from 'vitest';
import './hardware-preview';
import { HardwarePreview } from './hardware-preview';

describe('HardwarePreview', () => {
  let element: HardwarePreview;

  beforeEach(async () => {
    element = document.createElement('hardware-preview') as HardwarePreview;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  it('renders assembly with correct dimensions', async () => {
    element.width_mm = 200;
    element.height_mm = 150;
    element.scale = 2;
    await element.updateComplete;

    const assembly = element.shadowRoot?.querySelector('.assembly') as HTMLElement;
    expect(assembly.style.width).toBe('400px');
    expect(assembly.style.height).toBe('300px');
  });

  it('calculates mat position correctly', async () => {
    element.width_mm = 200;
    element.height_mm = 150;
    element.border_width_mm = 10;
    element.scale = 1;
    await element.updateComplete;

    const mat = element.shadowRoot?.querySelector('.preview-mat') as HTMLElement;
    expect(mat.style.top).toBe('10px');
    expect(mat.style.left).toBe('10px');
    expect(mat.style.width).toBe('180px');
    expect(mat.style.height).toBe('130px');
  });

  it('calculates display panel position correctly', async () => {
    element.width_mm = 200;
    element.height_mm = 150;
    element.border_width_mm = 10;
    element.panel_width_mm = 100;
    element.panel_height_mm = 80;
    element.scale = 1;
    await element.updateComplete;

    // matW = 180, matH = 130
    // matL = (180 - 100) / 2 = 40
    // matT = (130 - 80) / 2 = 25
    // panelTop = border + matT = 10 + 25 = 35
    // panelLeft = border + matL = 10 + 40 = 50

    const display = element.shadowRoot?.querySelector('.preview-display') as HTMLElement;
    expect(display.style.top).toBe('35px');
    expect(display.style.left).toBe('50px');
    expect(display.style.width).toBe('100px');
    expect(display.style.height).toBe('80px');
  });

  it('handles portrait orientation', async () => {
    element.width_mm = 200; // Physical width when landscape
    element.height_mm = 150; // Physical height when landscape
    element.orientation = 'portrait';
    element.scale = 1;
    await element.updateComplete;

    const assembly = element.shadowRoot?.querySelector('.assembly') as HTMLElement;
    expect(assembly.style.width).toBe('150px'); // Swapped
    expect(assembly.style.height).toBe('200px'); // Swapped
  });
});
