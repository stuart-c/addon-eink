import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DisplayTypeDialog } from './display-type-dialog';
import './display-type-dialog';

describe('DisplayTypeDialog', () => {
  let element: DisplayTypeDialog;
  const mockDisplayType = {
    id: 'dt1',
    name: 'Standard Display',
    width_mm: 100,
    height_mm: 100,
    panel_width_mm: 80,
    panel_height_mm: 60,
    width_px: 800,
    height_px: 600,
    colour_type: 'MONO',
    frame: { border_width_mm: 10, colour: '#000000' },
    mat: { colour: '#ffffff' }
  };

  beforeEach(async () => {
    element = document.createElement('display-type-dialog');
    element.displayTypes = [mockDisplayType] as any;
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should initialize with provided display types', () => {
    expect(element.displayTypes.length).toBe(1);
  });

  it('should detect when form is dirty', async () => {
    await element.show(mockDisplayType as any);
    // Initially not dirty because it's same as the one in displayTypes list
    // (Wait, the show() uses JSON stringify to clone it, so it should match)
    expect((element as any)._isDirty()).toBe(false);

    (element as any).displayType = { ...(element as any).displayType, name: 'Modified Name' };
    element.requestUpdate();
    await element.updateComplete;
    expect((element as any)._isDirty()).toBe(true);
  });

  it('should dispatch request-confirmation when closing and dirty', async () => {
    await element.show(mockDisplayType as any);
    (element as any).displayType = { ...(element as any).displayType, name: 'Modified Name' };
    element.requestUpdate();
    await element.updateComplete;
    
    const spy = vi.fn();
    element.addEventListener('request-confirmation', spy);
    
    (element as any)._handleHeaderClose();
    
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail.config.title).toBe('Unsaved Changes');
  });

  it('should dispatch request-confirmation when switching and dirty', async () => {
    await element.show(mockDisplayType as any);
    (element as any).displayType = { ...(element as any).displayType, name: 'Modified Name' };
    element.requestUpdate();
    await element.updateComplete;
    
    const spy = vi.fn();
    element.addEventListener('request-confirmation', spy);
    
    // Switch to null (Add New)
    (element as any)._handleSelect(null);
    
    expect(spy).toHaveBeenCalled();
  });

  it('should close directly when not dirty', async () => {
    await element.show(mockDisplayType as any);
    
    const spy = vi.fn();
    element.addEventListener('request-confirmation', spy);
    
    const closeBtn = element.shadowRoot?.querySelector('.close-button') as HTMLElement;
    closeBtn.click();
    
    expect(spy).not.toHaveBeenCalled();
    const dialog = element.shadowRoot?.querySelector('dialog');
    expect(dialog?.open).toBe(false);
  });

  it('should handle cancel event from dialog (Escape key)', async () => {
    await element.show(mockDisplayType as any);
    (element as any).displayType = { ...(element as any).displayType, name: 'Modified Name' };
    element.requestUpdate();
    await element.updateComplete;
    
    const spy = vi.fn();
    element.addEventListener('request-confirmation', spy);
    
    const dialog = element.shadowRoot?.querySelector('dialog');
    // Trigger the native 'cancel' event which happens on Escape
    const cancelEvent = new Event('cancel', { bubbles: true, cancelable: true });
    dialog?.dispatchEvent(cancelEvent);
    
    // Allow microtasks to settle
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Note: If this fails, it means we haven't implemented the listener yet!
    expect(spy).toHaveBeenCalled();
  });
});
