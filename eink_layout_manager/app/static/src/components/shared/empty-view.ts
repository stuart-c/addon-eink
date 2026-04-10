import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

@customElement('empty-view')
export class EmptyView extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--text-muted);
        text-align: center;
        padding: 2rem;
      }
      .icon {
        font-size: 64px;
        margin-bottom: 1rem;
        color: #ddd;
      }
      h2 {
        margin: 0 0 1rem 0;
        color: var(--text-muted);
        font-weight: 700;
      }
      p {
        max-width: 400px;
        line-height: 1.4;
        margin: 0;
      }
    `
  ];

  @property({ type: String }) title = 'Coming Soon';
  @property({ type: String }) message = 'This section is currently being initialised. Please check back later.';
  @property({ type: String }) icon = 'auto_awesome';

  render() {
    return html`
      <span class="material-icons icon">${this.icon}</span>
      <h2>${this.title}</h2>
      <p>${this.message}</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'empty-view': EmptyView;
  }
}
