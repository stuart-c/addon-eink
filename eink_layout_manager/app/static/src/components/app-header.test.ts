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

  it('should render the title with active section', () => {
    const title = element.shadowRoot?.querySelector('div > strong');
    expect(title?.textContent).toContain('eInk Layout Manager - Layouts');
  });

  it('should update the title when section changes', async () => {
    element.activeSection = 'images';
    await element.updateComplete;
    
    const title = element.shadowRoot?.querySelector('div > strong');
    expect(title?.textContent).toContain('eInk Layout Manager - Images');
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


  it('should dispatch toggle-view-mode event', async () => {
    const spy = vi.fn();
    element.addEventListener('toggle-view-mode', spy);
    
    const button = element.shadowRoot?.querySelector('button[title^="Switch to"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch save-changes event', async () => {
    const spy = vi.fn();
    element.addEventListener('save-changes', spy);
    
    const button = element.shadowRoot?.querySelector('button[title^="Save Changes"]') as HTMLButtonElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });
  it('should show loading state when saving', async () => {
    element.isSaving = true;
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button[title="Saving..."]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.querySelector('.material-icons')?.textContent).toBe('sync');
  });

  it('should dispatch discard-changes event', async () => {
    element.isDirty = true;
    await element.updateComplete;
    
    const spy = vi.fn();
    element.addEventListener('discard-changes', spy);
    
    const button = element.shadowRoot?.querySelector('button[title="Discard Changes"]') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should disable discard button when not dirty', async () => {
    element.isDirty = false;
    await element.updateComplete;
    
    const button = element.shadowRoot?.querySelector('button[title="Discard Changes"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
