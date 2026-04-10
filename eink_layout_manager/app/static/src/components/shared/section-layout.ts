import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

@customElement('section-layout')
export class SectionLayout extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .left-bar {
        width: 320px;
        flex-shrink: 0;
        background: var(--bg-white);
        border-right: 1px solid var(--border-colour);
        display: flex;
        flex-direction: column;
        z-index: 5;
      }
      .content-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        background: var(--bg-light);
      }
      .right-top-bar {
        height: 56px;
        background: var(--bg-white);
        border-bottom: 1px solid var(--border-colour);
        display: flex;
        align-items: center;
        padding: 0 1rem;
        flex-shrink: 0;
      }
      .right-main {
        flex: 1;
        position: relative;
        overflow: auto;
        background: #eee;
      }
    `
  ];

  render() {
    return html`
      <div class="left-bar">
        <slot name="left-bar"></slot>
      </div>
      <div class="content-area">
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

declare global {
  interface HTMLElementTagNameMap {
    'section-layout': SectionLayout;
  }
}
