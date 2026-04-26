import { Layout, DisplayType, Image as ImageMetadata, api } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';
import { 
  ditherImage, 
  getDefaultPalettes 
} from '../lib/epdoptimize/index';

/**
 * Controller for the Scene Item Settings Dialog.
 * Manages item configuration (images, scaling, offsets) and preview rendering.
 */
export class SceneItemSettingsController extends BaseViewController {
  public item: any = null;
  public selectedImageId: string | null = null;
  public scalingFactor = 100.0;
  public offsetX = 0;
  public offsetY = 0;
  public backgroundColor = '#ffffff';
  public layout: Layout | null = null;
  public displayTypes: DisplayType[] = [];
  public isAddingImage = false;
  public availableImages: ImageMetadata[] = [];
  public searchQuery = '';
  public previewCanvas: HTMLCanvasElement | null = null;
  
  private _updateTimer: any = null;

  public async show(item: any, layout: Layout, displayTypes: DisplayType[]) {
    this.item = item;
    this.layout = layout;
    this.displayTypes = displayTypes;
    this.isAddingImage = false;

    if (this.availableImages.length === 0) {
      try {
        this.availableImages = await api.getImages();
      } catch (e) {
        console.error('Failed to fetch images', e);
      }
    }

    if (item.images && item.images.length > 0) {
      this.selectedImageId = item.images[0].image_id;
      this.scalingFactor = item.images[0].scaling_factor || 100;
      this.offsetX = item.images[0].offset?.x || 0;
      this.offsetY = item.images[0].offset?.y || 0;
      this.backgroundColor = item.images[0].background_color || '#ffffff';
    } else {
      this.selectedImageId = null;
      this.backgroundColor = '#ffffff';
    }
    
    this.triggerUpdate();
    this.host.requestUpdate();
  }

  public triggerUpdate() {
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }
    this._updateTimer = setTimeout(() => this.updatePreview(), 250);
  }

  private async updatePreview() {
    if (!this.selectedImageId || !this.item || !this.previewData.width) {
      this.previewCanvas = null;
      this.host.requestUpdate();
      return;
    }

    const image = this.availableImages.find(i => i.id === this.selectedImageId);
    if (!image) return;

    try {
      const imgElement = new Image();
      imgElement.crossOrigin = 'anonymous';
      imgElement.src = `/api/image/${image.id}/file`;
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
      });

      const firstDisplayId = this.item.displays[0];
      const layoutBox = this.layout?.items.find(i => i.id === firstDisplayId);
      const dt = this.displayTypes.find(t => t.id === layoutBox?.display_type_id);
      if (!dt || !dt.width_mm || !dt.width_px) return;

      const pxPerMm = dt.width_px / dt.width_mm;
      const canvasWidthPx = Math.round(this.previewData.width * pxPerMm);
      const canvasHeightPx = Math.round(this.previewData.height * pxPerMm);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasWidthPx;
      tempCanvas.height = canvasHeightPx;
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, canvasWidthPx, canvasHeightPx);

      const brightness = image.brightness ?? 1.0;
      const contrast = image.contrast ?? 1.0;
      const saturation = image.saturation ?? 1.0;
      ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;

      const scaledWidth = (image.dimensions.width * this.scalingFactor) / 100;
      const scaledHeight = (image.dimensions.height * this.scalingFactor) / 100;

      const frameBB = this.previewData;
      const panelBB = this.panelBoundingBox;
      const relX = (panelBB.minX - frameBB.minX) * pxPerMm;
      const relY = (panelBB.minY - frameBB.minY) * pxPerMm;

      ctx.drawImage(imgElement, relX + this.offsetX, relY + this.offsetY, scaledWidth, scaledHeight);
      ctx.filter = 'none';

      const ditherCanvas = document.createElement('canvas');
      ditherCanvas.width = canvasWidthPx;
      ditherCanvas.height = canvasHeightPx;

      const palette = this.getPaletteForDisplays();
      const options = {
        ditheringType: image.conversion?.ditheringType || 'errorDiffusion',
        errorDiffusionMatrix: image.conversion?.errorDiffusionMatrix || 'floydSteinberg',
        serpentine: image.conversion?.serpentine ?? false,
        palette,
        processingPreset: image.conversion?.processingPreset || ''
      };

      await ditherImage(tempCanvas, ditherCanvas, options as any);
      this.previewCanvas = ditherCanvas;
    } catch (e) {
      console.error('Failed to dither preview', e);
    }
    this.host.requestUpdate();
  }

  private getPaletteForDisplays(): string[] {
    const displayTypeIds = new Set(
      this.layout?.items
        .filter(i => this.item.displays.includes(i.id))
        .map(i => i.display_type_id)
    );

    const palettes: Set<string> = new Set();
    displayTypeIds.forEach(id => {
      const dt = this.displayTypes.find(t => t.id === id);
      if (dt) {
        if (dt.colour_type === 'BWGBRY') palettes.add('spectra6');
        else if (dt.colour_type === 'BWR') palettes.add('acep');
        else palettes.add('default');
      }
    });

    const paletteName = palettes.values().next().value || 'default';
    return getDefaultPalettes(paletteName);
  }

  public async toggleAddImage() {
    this.isAddingImage = !this.isAddingImage;
    if (this.isAddingImage && this.availableImages.length === 0) {
      try {
        this.availableImages = await api.getImages();
      } catch (e) {
        console.error('Failed to fetch images', e);
      }
    }
    this.host.requestUpdate();
  }

  public selectImage(image: ImageMetadata) {
    if (!this.item.images) {
      this.item.images = [];
    }
    
    if (this.item.images.find((img: any) => img.image_id === image.id)) {
      this.isAddingImage = false;
      this.selectedImageId = image.id;
      return;
    }

    const newImage = {
      image_id: image.id,
      scaling_factor: 100,
      offset: { x: 0, y: 0 },
      background_color: '#ffffff'
    };
    
    this.item.images = [...this.item.images, newImage];
    this.selectedImageId = image.id;
    this.scalingFactor = 100;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.fillImage();
    this.isAddingImage = false;
    this.host.requestUpdate();
  }

  public moveImage(dx: number, dy: number, reset = false) {
    if (reset) {
      this.offsetX = 0;
      this.offsetY = 0;
    } else {
      this.offsetX += dx;
      this.offsetY += dy;
    }

    if (this.selectedImageId) {
      const img = this.item.images.find((i: any) => i.image_id === this.selectedImageId);
      if (img) {
        img.offset.x = this.offsetX;
        img.offset.y = this.offsetY;
      }
    }
    this.host.requestUpdate();
  }

  public updateBackgroundColor(color: string) {
    this.backgroundColor = color;
    if (this.selectedImageId) {
      const img = this.item.images.find((i: any) => i.image_id === this.selectedImageId);
      if (img) {
        img.background_color = color;
      }
    }
    this.host.requestUpdate();
  }

  public applyImageFitting(mode: 'fit' | 'fill') {
    if (!this.selectedImageId || !this.item || !this.item.displays || this.item.displays.length === 0) return;
    const image = this.availableImages.find(i => i.id === this.selectedImageId);
    if (!image) return;

    const panelBB = this.panelBoundingBox;
    const firstDisplayId = this.item.displays[0];
    const layoutBox = this.layout?.items.find(i => i.id === firstDisplayId);
    const dt = this.displayTypes.find(t => t.id === layoutBox?.display_type_id);
    if (!dt || !dt.width_mm || !dt.width_px) return;

    const pxPerMm = dt.width_px / dt.width_mm;
    const targetWidthPx = panelBB.width * pxPerMm;
    const targetHeightPx = panelBB.height * pxPerMm;

    const scaleW = targetWidthPx / image.dimensions.width;
    const scaleH = targetHeightPx / image.dimensions.height;
    
    if (mode === 'fit') {
      this.scalingFactor = parseFloat((Math.min(scaleW, scaleH) * 100).toFixed(1));
    } else {
      this.scalingFactor = parseFloat((Math.max(scaleW, scaleH) * 100).toFixed(1));
    }

    const scaledWidth = (image.dimensions.width * this.scalingFactor) / 100;
    const scaledHeight = (image.dimensions.height * this.scalingFactor) / 100;

    this.offsetX = Math.round((targetWidthPx - scaledWidth) / 2);
    this.offsetY = Math.round((targetHeightPx - scaledHeight) / 2);

    const img = this.item.images.find((i: any) => i.image_id === this.selectedImageId);
    if (img) {
      img.scaling_factor = this.scalingFactor;
      img.offset = { x: this.offsetX, y: this.offsetY };
    }
  }

  public fillImage() {
    this.applyImageFitting('fill');
  }

  public fitImage() {
    this.applyImageFitting('fit');
  }

  public get previewData() {
    if (!this.layout || !this.item || !this.item.displays || this.item.displays.length === 0) {
      return { width: 0, height: 0, items: [], minX: 0, minY: 0 };
    }

    const visibleItems = this.layout.items.filter(i => this.item.displays.includes(i.id));
    if (visibleItems.length === 0) {
      return { width: 0, height: 0, items: [], minX: 0, minY: 0 };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const itemsWithDimensions = visibleItems.map(item => {
      const dt = this.displayTypes.find(t => t.id === item.display_type_id);
      if (!dt) return { item, w: 0, h: 0 };
      const isPortrait = item.orientation === 'portrait';
      const w = isPortrait ? dt.height_mm : dt.width_mm;
      const h = isPortrait ? dt.width_mm : dt.height_mm;
      minX = Math.min(minX, item.x_mm);
      minY = Math.min(minY, item.y_mm);
      maxX = Math.max(maxX, item.x_mm + w);
      maxY = Math.max(maxY, item.y_mm + h);
      return { item, w, h };
    });

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);
    const adjustedItems = itemsWithDimensions.map(({ item }) => ({
      ...item,
      x_mm: item.x_mm - minX,
      y_mm: item.y_mm - minY
    }));

    return { width, height, items: adjustedItems, minX, minY };
  }

  public get panelBoundingBox() {
    if (!this.layout || !this.item || !this.item.displays || this.item.displays.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    const visibleItems = this.layout.items.filter(i => this.item.displays.includes(i.id));
    if (visibleItems.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0 };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    visibleItems.forEach(item => {
      const dt = this.displayTypes.find(t => t.id === item.display_type_id);
      if (!dt) return;

      const isPortrait = item.orientation === 'portrait';
      const frameW = isPortrait ? dt.height_mm : dt.width_mm;
      const frameH = isPortrait ? dt.width_mm : dt.height_mm;
      const panelW = isPortrait ? dt.panel_height_mm : dt.panel_width_mm;
      const panelH = isPortrait ? dt.panel_width_mm : dt.panel_height_mm;

      const panelX = item.x_mm + (frameW - panelW) / 2;
      const panelY = item.y_mm + (frameH - panelH) / 2;

      minX = Math.min(minX, panelX);
      minY = Math.min(minY, panelY);
      maxX = Math.max(maxX, panelX + panelW);
      maxY = Math.max(maxY, panelY + panelH);
    });

    return { 
      width: Math.max(0, maxX - minX), 
      height: Math.max(0, maxY - minY),
      minX, 
      minY 
    };
  }
}
