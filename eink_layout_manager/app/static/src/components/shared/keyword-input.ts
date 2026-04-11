import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';
import { api, KeywordInfo } from '../../services/HaApiClient';

/**
 * A modern, chip-based keyword input component with autocomplete.
 */
@customElement('keyword-input')
export class KeywordInput extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
      }

      .keyword-input-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 6px;
        border: 1px solid var(--border-colour);
        border-radius: var(--border-radius);
        background: white;
        min-height: 42px;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
        align-items: center;
      }

      .keyword-input-container:focus-within {
        border-color: var(--primary-colour);
        box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
      }

      .keyword-chip {
        display: inline-flex;
        align-items: center;
        background: #e1f5fe;
        color: var(--primary-hover);
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 500;
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }

      .keyword-chip .remove-btn {
        display: flex;
        align-items: center;
        margin-left: 6px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .keyword-chip .remove-btn:hover {
        opacity: 1;
      }

      .keyword-chip .remove-btn .material-icons {
        font-size: 14px;
      }

      input {
        flex: 1;
        min-width: 120px;
        border: none !important;
        padding: 4px 8px !important;
        margin: 0 !important;
        height: 28px !important;
        font-size: 14px !important;
      }

      input:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      .suggestion-help {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .suggestion-help .material-icons {
        font-size: 14px;
      }
    `
  ];

  @property({ type: Array }) keywords: string[] = [];
  @state() private _allKeywords: KeywordInfo[] = [];
  @query('input') private _inputElement!: HTMLInputElement;

  async connectedCallback() {
    super.connectedCallback();
    try {
      this._allKeywords = await api.getKeywords();
    } catch (e) {
      console.error('Failed to load keywords', e);
    }
  }

  private _addKeyword(value: string) {
    const trimmed = value.trim();
    if (trimmed && !this.keywords.includes(trimmed)) {
      this.keywords = [...this.keywords, trimmed];
      this._dispatchEvent();
      return true;
    }
    return false;
  }

  private _removeKeyword(kw: string) {
    this.keywords = this.keywords.filter(k => k !== kw);
    this._dispatchEvent();
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (this._addKeyword(this._inputElement.value)) {
        this._inputElement.value = '';
      }
    } else if (e.key === 'Backspace' && this._inputElement.value === '' && this.keywords.length > 0) {
      this._removeKeyword(this.keywords[this.keywords.length - 1]);
    }
  }

  private _handleInput() {
    // If user selects an option from datalist, it might not trigger keydown properly for Enter
    // We can check if the value matches one of our suggestions
    const value = this._inputElement.value;
    if (this._allKeywords.some(k => k.keyword === value)) {
      this._addKeyword(value);
      this._inputElement.value = '';
    }
  }

  private _dispatchEvent() {
    this.dispatchEvent(new CustomEvent('keywords-changed', {
      detail: { keywords: this.keywords },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="keyword-input-container" @click="${() => this._inputElement.focus()}">
        ${this.keywords.map(kw => html`
          <div class="keyword-chip">
            ${kw}
            <span class="remove-btn" @click="${(e: Event) => {
              e.stopPropagation();
              this._removeKeyword(kw);
            }}">
              <span class="material-icons">close</span>
            </span>
          </div>
        `)}
        <input 
          type="text" 
          placeholder="${this.keywords.length === 0 ? 'Add keywords...' : ''}"
          list="keyword-suggestions"
          @keydown="${this._handleKeyDown}"
          @input="${this._handleInput}"
        >
        <datalist id="keyword-suggestions">
          ${this._allKeywords
            .filter(k => !this.keywords.includes(k.keyword))
            .map(k => html`<option value="${k.keyword}">${k.keyword} (${k.count})</option>`)}
        </datalist>
      </div>
      <div class="suggestion-help">
        <span class="material-icons">info</span>
        Press Enter or comma to add. Existing tags will be suggested as you type.
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'keyword-input': KeywordInput;
  }
}
