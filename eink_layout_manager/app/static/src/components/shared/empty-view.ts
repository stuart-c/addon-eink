import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('empty-view')
export class EmptyView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      text-align: center;
      padding: 2rem;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 1.5rem;
      opacity: 0.3;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #777;
      font-weight: 600;
    }
    p {
      margin: 0;
      max-width: 400px;
      line-height: 1.5;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: #eee;
      padding: 4px 12px;
      border-radius: 20px;
      margin-top: 1.5rem;
      font-weight: 700;
      color: #888;
    }
  `;

  @property({ type: String }) title = '';
  @property({ type: String }) icon = 'info';
  @property({ type: String }) message = 'This section is not yet implemented.';

  render() {
    return html`
      <span class="material-icons icon">${this.icon}</span>
      <h2>${this.title}</h2>
      <p>${this.message}</p>
      <div class="badge">Coming Soon</div>
    `;
  }
}
