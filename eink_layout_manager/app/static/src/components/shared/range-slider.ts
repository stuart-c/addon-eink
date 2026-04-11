import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

/**
 * A dual-handle range slider component for selecting a numeric range.
 */
@customElement('range-slider')
export class RangeSlider extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        padding-top: 10px;
        padding-bottom: 20px;
      }

      .slider-container {
        position: relative;
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
      }

      .slider-track {
        position: absolute;
        width: 100%;
        height: 6px;
        background: #e1e4e8;
        border-radius: 3px;
        z-index: 1;
      }

      .active-track {
        position: absolute;
        height: 6px;
        background: var(--primary-colour);
        border-radius: 3px;
        z-index: 2;
      }

      input[type="range"] {
        position: absolute;
        width: 100%;
        pointer-events: none;
        appearance: none;
        height: 6px;
        background: none;
        z-index: 3;
        margin: 0;
      }

      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        pointer-events: auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--primary-colour);
        cursor: pointer;
        box-shadow: var(--shadow-small);
        transition: transform 0.1s;
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 0 0 5px rgba(3, 169, 244, 0.1);
      }

      input[type="range"]::-webkit-slider-thumb:active {
        transform: scale(1.1);
        background: var(--primary-colour);
      }

      input[type="range"]::-moz-range-thumb {
        pointer-events: auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        border: 2px solid var(--primary-colour);
        cursor: pointer;
        box-shadow: var(--shadow-small);
      }

      .labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
      }

      .value-bubble {
        font-weight: 600;
        color: var(--primary-hover);
      }
    `
  ];

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) valueLow = 0;
  @property({ type: Number }) valueHigh = 100;
  @property({ type: String }) label = '';

  @query('#low') private _lowInput!: HTMLInputElement;
  @query('#high') private _highInput!: HTMLInputElement;

  private _onInput(e: Event) {
    const isLow = (e.target as HTMLInputElement).id === 'low';
    let low = parseInt(this._lowInput.value);
    let high = parseInt(this._highInput.value);

    if (isLow) {
      if (low >= high) {
        low = high - 1;
        this._lowInput.value = String(low);
      }
    } else {
      if (high <= low) {
        high = low + 1;
        this._highInput.value = String(high);
      }
    }

    this.valueLow = low;
    this.valueHigh = high;

    this.dispatchEvent(new CustomEvent('range-change', {
      detail: { low, high },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const lowPercent = ((this.valueLow - this.min) / (this.max - this.min)) * 100;
    const highPercent = ((this.valueHigh - this.min) / (this.max - this.min)) * 100;

    return html`
      <label>${this.label}</label>
      <div class="slider-container">
        <div class="slider-track"></div>
        <div 
          class="active-track" 
          style="left: ${lowPercent}%; width: ${highPercent - lowPercent}%"
        ></div>
        <input 
          type="range" 
          id="low" 
          .min="${String(this.min)}" 
          .max="${String(this.max)}" 
          .value="${String(this.valueLow)}"
          @input="${this._onInput}"
        >
        <input 
          type="range" 
          id="high" 
          .min="${String(this.min)}" 
          .max="${String(this.max)}" 
          .value="${String(this.valueHigh)}"
          @input="${this._onInput}"
        >
      </div>
      <div class="labels">
        <span>${this.min}</span>
        <span class="value-bubble">${this.valueLow} — ${this.valueHigh}</span>
        <span>${this.max}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'range-slider': RangeSlider;
  }
}
