import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import yaml from 'js-yaml';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import { commonStyles } from '../styles/common-styles';
import { Layout } from '../services/HaApiClient';

/**
 * A sleek YAML editor for layouts with real-time syntax highlighting
 * and bi-directional sync with the graphical editor.
 */
@customElement('yaml-editor')
export class YamlEditor extends LitElement {
  static styles = [
    commonStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
      }
      :host([hidden]) {
        display: none !important;
      }
      .editor-container {
        flex: 1;
        position: relative;
        overflow: hidden;
        background: #1e1e1e;
      }
      .editor-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 24px;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
        tab-size: 2;
        margin: 0;
        border: none;
        overflow: auto;
      }
      textarea {
        background: transparent;
        color: transparent;
        caret-color: #03a9f4;
        z-index: 2;
        resize: none;
        outline: none;
        -webkit-text-fill-color: transparent;
      }
      pre {
        z-index: 1;
        pointer-events: none;
        background: transparent;
        color: #d4d4d4;
      }
      code {
        font-family: inherit;
      }
      .status-bar {
        padding: 6px 16px;
        font-size: 11px;
        background: #252526;
        border-top: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
      }
      .status-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .error {
        color: var(--danger-colour);
      }
      .success {
        color: #4caf50;
      }

      /* Prism YAML Theme Overrides (Dark+) */
      .token.comment { color: #6a9955; }
      .token.atrule { color: #c586c0; }
      .token.attr-name { color: #9cdcfe; }
      .token.string { color: #ce9178; }
      .token.boolean, .token.number { color: #b5cea8; }
      .token.key { color: #9cdcfe; }
      .token.keyword { color: #569cd6; }
      .token.punctuation { color: #d4d4d4; }
      .token.important { color: #569cd6; font-weight: bold; }
    `
  ];

  @property({ type: Object }) layout: Layout | null = null;
  @state() private _yamlText = '';
  @state() private _errorMessage = '';
  
  @query('textarea') private _textarea!: HTMLTextAreaElement;
  @query('pre') private _highlightLayer!: HTMLPreElement;

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('layout') && this.layout) {
      // Strip internal properties like 'invalid' before showing in YAML
      const cleanLayout = this._getCleanLayout(this.layout);
      const currentYaml = this._dumpYaml(cleanLayout);
      
      // Only update if the logical content is actually different to avoid cursor jumping
      if (this._yamlText === '' || !this._isYamlEqual(this._yamlText, currentYaml)) {
        this._yamlText = currentYaml;
      }
    }
  }

  private _getCleanLayout(layout: Layout): any {
    const clean = JSON.parse(JSON.stringify(layout));
    if (clean.items) {
      clean.items.forEach((i: any) => delete i.invalid);
    }
    return clean;
  }

  private _dumpYaml(obj: any): string {
    return yaml.dump(obj, { 
      indent: 2, 
      noRefs: true, 
      sortKeys: false, // Keep order as defined in schema for better readability
      lineWidth: -1 
    });
  }

  private _isYamlEqual(y1: string, y2: string): boolean {
    try {
      const o1 = yaml.load(y1);
      const o2 = yaml.load(y2);
      return JSON.stringify(o1) === JSON.stringify(o2);
    } catch {
      return false;
    }
  }

  private _handleInput(e: Event) {
    const val = (e.target as HTMLTextAreaElement).value;
    this._yamlText = val;
    this._validateAndSync(val);
  }

  private _validateAndSync(val: string) {
    try {
      const parsed = yaml.load(val) as Layout;
      if (parsed && typeof parsed === 'object' && parsed.id) {
        this._errorMessage = '';
        this.dispatchEvent(new CustomEvent('layout-update', {
          detail: parsed,
          bubbles: true,
          composed: true
        }));
      } else {
        this._errorMessage = 'Invalid layout structure';
      }
    } catch (e: any) {
      this._errorMessage = e.reason || e.message;
    }
  }

  private _handleScroll() {
    this._highlightLayer.scrollTop = this._textarea.scrollTop;
    this._highlightLayer.scrollLeft = this._textarea.scrollLeft;
  }

  render() {
    const highlighted = Prism.highlight(this._yamlText, Prism.languages.yaml, 'yaml');

    return html`
      <div class="editor-container">
        <textarea
          class="editor-layer"
          .value="${this._yamlText}"
          @input="${this._handleInput}"
          @scroll="${this._handleScroll}"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        ></textarea>
        <pre class="editor-layer" aria-hidden="true"><code class="language-yaml">${unsafeHTML(highlighted)}</code></pre>
      </div>
      <div class="status-bar">
        <div class="status-item ${this._errorMessage ? 'error' : 'success'}">
          <span class="material-icons" style="font-size: 14px;">
            ${this._errorMessage ? 'error_outline' : 'check_circle_outline'}
          </span>
          ${this._errorMessage || 'Valid YAML'}
        </div>
        <div class="status-item">
          <span>Schema: Layout (v${this.layout?.id || '?'})</span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yaml-editor': YamlEditor;
  }
}
