import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonStyles } from '../../styles/common-styles';

/**
 * A discrete slider component for selecting grid snap values.
 * Selectable entries: 1mm, 5mm, 10mm, 20mm.
 */
@customElement('grid-snap-slider')
export class GridSnapSlider extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: block;
        padding: 10px 0;
      }

      .slider-container {
        position: relative;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      input[type="range"] {
        position: absolute;
        width: 100%;
        appearance: none;
        background: none;
        height: 24px;
        margin: 0;
        z-index: 3;
        cursor: pointer;
        padding: 0;
      }

      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--primary-colour);
        box-shadow: var(--shadow-small);
        transition: transform 0.1s;
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }

      input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--primary-colour);
        box-shadow: var(--shadow-small);
      }

      .labels {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        padding: 0 4px;
      }

      .label-item {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.2s;
        flex: 1;
        text-align: center;
      }

      .label-item:first-child { text-align: left; }
      .label-item:last-child { text-align: right; }

      .label-item.active {
        color: var(--primary-colour);
      }

      .ticks {
        position: absolute;
        top: 21px; /* Center with track */
        width: calc(100% - 22px);
        left: 11px;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
        z-index: 1;
      }

      .tick {
        width: 2px;
        height: 6px;
        background: #ccc;
      }
    `
  ];

  @property({ type: Number }) value = 5;

  private _steps = [1, 5, 10, 20];

  private _onInput(e: Event) {
    const stepIndex = parseInt((e.target as HTMLInputElement).value);
    const newValue = this._steps[stepIndex];
    this.value = newValue;
    this._dispatchChange();
  }

  private _dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _setStep(index: number) {
    this.value = this._steps[index];
    this._dispatchChange();
  }

  render() {
    const stepIndex = this._steps.indexOf(this.value);
    const percent = (stepIndex / (this._steps.length - 1)) * 100;

    return html`
      <div class="slider-container">
        <div class="slider-track"></div>
        <div class="active-track" style="width: ${percent}%"></div>
        <div class="ticks">
          ${this._steps.map(() => html`<div class="tick"></div>`)}
        </div>
        <input 
          type="range" 
          min="0" 
          max="3" 
          step="1" 
          .value="${stepIndex.toString()}"
          @input="${this._onInput}"
        >
      </div>
      <div class="labels">
        ${this._steps.map((step, index) => html`
          <span 
            class="label-item ${this.value === step ? 'active' : ''}"
            @click="${() => this._setStep(index)}"
          >
            ${step}mm
          </span>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'grid-snap-slider': GridSnapSlider;
  }
}
