import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppHeader } from './app-header';
import './app-header';

describe('AppHeader', () => {
  let element: AppHeader;

  beforeEach(async () => {
    element = document.createElement('app-header');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the title', () => {
    const title = element.shadowRoot?.querySelector('strong');
    expect(title?.textContent).toBe('eInk Layout Manager');
  });

  it('should render navigation icons', () => {
    const nav = element.shadowRoot?.querySelector('.nav-group');
    const icons = nav?.querySelectorAll('.nav-item');
    expect(icons?.length).toBe(4);
  });

  it('should display the message when provided', async () => {
    element.message = 'Test Message';
    await element.updateComplete;
    
    const badge = element.shadowRoot?.querySelector('.message-badge');
    expect(badge?.textContent).toBe('Test Message');
  });

  it('should reflect connected status', async () => {
    element.connected = true;
    await element.updateComplete;
    let dot = element.shadowRoot?.querySelector('.status-dot');
    expect(dot?.textContent).toBe('Online');

    element.connected = false;
    await element.updateComplete;
    dot = element.shadowRoot?.querySelector('.status-dot');
    expect(dot?.textContent).toBe('Offline');
  });

  it('should dispatch edit-layout event', async () => {
    const spy = vi.fn();
    element.addEventListener('edit-layout', spy);
    
    const button = element.shadowRoot?.querySelector('button[title="Layout Settings"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch toggle-view-mode event', async () => {
    const spy = vi.fn();
    element.addEventListener('toggle-view-mode', spy);
    
    const button = element.shadowRoot?.querySelector('button[title^="Switch to"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch save-layout event', async () => {
    const spy = vi.fn();
    element.addEventListener('save-layout', spy);
    
    const button = element.shadowRoot?.querySelector('button[title="Save Layout"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch set-section event when nav item is clicked', async () => {
    const spy = vi.fn();
    element.addEventListener('set-section', spy);
    
    const navItem = element.shadowRoot?.querySelector('.nav-item[title="Images"]') as HTMLButtonElement;
    navItem.click();
    
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      detail: 'images'
    }));
  });
});
