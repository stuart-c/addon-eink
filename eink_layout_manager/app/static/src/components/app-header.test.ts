import { describe, it, expect, beforeEach, vi } from 'vitest';
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
    const title = element.shadowRoot?.querySelector('div > strong');
    expect(title?.textContent).toBe('eInk Layout Manager');
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
    
    const button = element.shadowRoot?.querySelector('button[title^="Save Layout"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should disable save button when isSaving is true', async () => {
    element.isSaving = true;
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button[title^="Saving..."]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.querySelector('.material-icons')?.textContent).toBe('sync');
  });
});
