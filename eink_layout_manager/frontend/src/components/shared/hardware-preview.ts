import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * A shared component for rendering the physical display assembly:
 * Frame -> Mat -> Display Panel
 */
@customElement('hardware-preview')
export class HardwarePreview extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .preview-layer {
      position: absolute;
      box-shadow: 4px 4px 10px rgba(0,0,0,0.15);
      transition: all 0.2s ease-out;
    }
    .preview-frame { z-index: 10; border-radius: 2px; }
    .preview-mat { z-index: 20; border-radius: 1px; }
    .preview-display { 
      z-index: 30; 
      background: #fff; 
      border: 1px solid rgba(0,0,0,0.1);
    }
  `;

  @property({ type: Object }) previewImage: HTMLCanvasElement | string | null = null;
  @property({ type: Object }) previewOffset: { x: number; y: number } = { x: 0, y: 0 };
  @property({ type: Object }) previewTotalSize: { width: number; height: number } = { width: 0, height: 0 };

  render() {
    const isPortrait = this.orientation === 'portrait';
    const frameW = isPortrait ? (this.height_mm || 0) : (this.width_mm || 0);
    const frameH = isPortrait ? (this.width_mm || 0) : (this.height_mm || 0);
    const border = this.border_width_mm || 0;
    const panelW = isPortrait ? (this.panel_height_mm || 0) : (this.panel_width_mm || 0);
    const panelH = isPortrait ? (this.panel_width_mm || 0) : (this.panel_height_mm || 0);

    const matW = frameW - (2 * border);
    const matH = frameH - (2 * border);
    
    const matL = (matW - panelW) / 2;
    const matT = (matH - panelH) / 2;

    const assemblyStyle = `width: ${frameW * this.scale}px; height: ${frameH * this.scale}px;`;
    const frameStyle = `width: 100%; height: 100%; background: ${this.frame_colour};`;
    const matStyle = `
      top: ${border * this.scale}px; 
      left: ${border * this.scale}px; 
      width: ${matW * this.scale}px; 
      height: ${matH * this.scale}px; 
      background: ${this.mat_colour};
    `;

    let displayStyle = `
      top: ${(border + matT) * this.scale}px; 
      left: ${(border + matL) * this.scale}px; 
      width: ${panelW * this.scale}px; 
      height: ${panelH * this.scale}px;
    `;

    if (this.previewImage && this.previewTotalSize.width > 0) {
      // Calculate background position to align with the total preview area
      // previewOffset is the top-left of this display's FRAME in the total area.
      // We need to account for the border and mat offset to find the top-left of the DISPLAY PANEL.
      const displayLeftInArea = this.previewOffset.x + border + matL;
      const displayTopInArea = this.previewOffset.y + border + matT;

      const bgPosX = -displayLeftInArea * this.scale;
      const bgPosY = -displayTopInArea * this.scale;
      const bgSizeW = this.previewTotalSize.width * this.scale;
      const bgSizeH = this.previewTotalSize.height * this.scale;

      displayStyle += `
        background-image: url(${typeof this.previewImage === 'string' ? this.previewImage : (this.previewImage as HTMLCanvasElement).toDataURL()});
        background-position: ${bgPosX}px ${bgPosY}px;
        background-size: ${bgSizeW}px ${bgSizeH}px;
        background-repeat: no-repeat;
      `;
    }

    return html`
      <div class="assembly" style="${assemblyStyle}">
        <div class="preview-layer preview-frame" style="${frameStyle}"></div>
        <div class="preview-layer preview-mat" style="${matStyle}"></div>
        <div class="preview-layer preview-display" style="${displayStyle}"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hardware-preview': HardwarePreview;
  }
}
