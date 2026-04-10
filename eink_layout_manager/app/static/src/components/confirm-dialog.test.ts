import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';
import './confirm-dialog';

describe('ConfirmDialog', () => {
  let element: ConfirmDialog;

  beforeEach(async () => {
    element = document.createElement('confirm-dialog');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render the default message', async () => {
    // We need to call show to trigger rendering if it's dynamic, 
    // but the component might render the base-dialog always.
    const p = element.shadowRoot?.querySelector('p');
    expect(p?.textContent).toBe('Are you sure?');
  });

  it('should show custom title and message', async () => {
    const promise = element.show({
      title: 'Custom Title',
      message: 'Custom Message'
    });
    await element.updateComplete;

    const baseDialog = element.shadowRoot?.querySelector('base-dialog');
    expect(baseDialog?.getAttribute('title')).toBe('Custom Title');
    
    const p = element.shadowRoot?.querySelector('p');
    expect(p?.textContent).toBe('Custom Message');
    
    // Cleanup/Close dialog
    const cancelBtn = element.shadowRoot?.querySelector('button.secondary') as HTMLButtonElement;
    cancelBtn.click();
    await promise;
  });

  it('should resolve with true when confirm is clicked', async () => {
    const promise = element.show({ confirmText: 'Yes Please' });
    await element.updateComplete;

    const confirmBtn = Array.from(element.shadowRoot?.querySelectorAll('button') || [])
      .find(b => b.textContent?.trim() === 'Yes Please') as HTMLButtonElement;
    
    confirmBtn.click();
    
    const result = await promise;
    expect(result).toBe(true);
  });

  it('should resolve with false when cancel is clicked', async () => {
    const promise = element.show({});
    await element.updateComplete;

    const cancelBtn = element.shadowRoot?.querySelector('button.secondary') as HTMLButtonElement;
    cancelBtn.click();
    
    const result = await promise;
    expect(result).toBe(false);
  });

  it('should render custom buttons and resolve with their value', async () => {
    const promise = element.show({
      buttons: [
        { text: 'Option A', value: 'a' },
        { text: 'Option B', value: 'b', type: 'danger' }
      ]
    });
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll('button');
    expect(buttons?.length).toBe(2);
    expect(buttons?.[0].textContent?.trim()).toBe('Option A');
    expect(buttons?.[1].textContent?.trim()).toBe('Option B');
    expect(buttons?.[1].classList.contains('danger')).toBe(true);

    buttons?.[1].click();
    const result = await promise;
    expect(result).toBe('b');
  });
});
