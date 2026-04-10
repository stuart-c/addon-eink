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
        margin-bottom: 1.5rem;
        opacity: 0.2;
      }
      h2 {
        margin: 0 0 0.5rem 0;
        color: var(--text-colour);
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      p {
        max-width: 400px;
        line-height: 1.6;
        margin: 0;
      }
      .badge {
        margin-top: 2rem;
        padding: 0.5rem 1rem;
        background: rgba(33, 150, 243, 0.1);
        color: var(--primary-colour);
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
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
      <div class="badge">Development in Progress</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'empty-view': EmptyView;
  }
}
