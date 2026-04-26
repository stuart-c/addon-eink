import { vi } from 'vitest';

/**
 * Polyfill for HTMLDialogElement in JSDOM environment.
 * JSDOM does not yet support the <dialog> element's show, showModal, and close methods.
 */
const polyfill = (proto: any) => {
  if (proto.showModal) return;
  
  proto.show = vi.fn(function (this: HTMLElement) {
    this.setAttribute('open', '');
  });
  
  proto.showModal = vi.fn(function (this: HTMLElement) {
    this.setAttribute('open', '');
  });
  
  proto.close = vi.fn(function (this: HTMLElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close', { bubbles: true }));
  });
};

if (typeof HTMLDialogElement !== 'undefined') {
  polyfill(HTMLDialogElement.prototype);
} else {
  // Fallback to polyfilling a generic HTMLElement if HTMLDialogElement is missing
  // (though JSDOM should have it, just not implemented)
  console.log('HTMLDialogElement not found, applying polyfill to generic dialog-like elements');
}

/**
 * Mock for ResizeObserver which is not supported in JSDOM.
 */
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);
