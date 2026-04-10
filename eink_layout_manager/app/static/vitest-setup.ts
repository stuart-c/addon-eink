import { vi } from 'vitest';

// Polyfill HTMLDialogElement for JSDOM
// JSDOM doesn't support <dialog> methods yet
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close', { bubbles: true }));
  });
}
