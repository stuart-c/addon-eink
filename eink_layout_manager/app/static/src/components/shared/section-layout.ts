import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('section-layout')
export class SectionLayout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .left-bar {
      width: 320px;
      flex-shrink: 0;
      background: white;
      border-right: 1px solid var(--border-colour);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .right-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background: #f0f2f5;
    }
    .right-top-bar {
      height: 60px;
      flex-shrink: 0;
      background: white;
      border-bottom: 1px solid var(--border-colour);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      z-index: 5;
    }
    .right-main {
      flex: 1;
      overflow: auto;
      position: relative;
    }
  `;

  render() {
    return html`
      <div class="left-bar">
        <slot name="left-bar"></slot>
      </div>
      <div class="right-content">
        <div class="right-top-bar">
          <slot name="right-top-bar"></slot>
        </div>
        <div class="right-main">
          <slot name="right-main"></slot>
        </div>
      </div>
    `;
  }
}
