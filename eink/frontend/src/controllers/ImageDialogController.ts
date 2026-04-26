import { api, Image as ImageMetadata } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';
import { 
  ditherImage, 
  suggestCanvasProcessingOptions,
  getDefaultPalettes 
} from '../lib/epdoptimize/index';

/**
 * Controller for the Image Dialog.
 * Manages image upload, metadata editing, and preview rendering.
 */
export class ImageDialogController extends BaseViewController {
  public uploadedImage: ImageMetadata | null = null;
  public editingImage: ImageMetadata | null = null;
  public isUploading = false;
  public error: string | null = null;
  
  // Form state
  public keywords: string[] = [];
  public imageName = '';
  public artist = '';
  public collection = '';
  public description = '';
  public brightness = 1.0;
  public contrast = 1.0;
  public saturation = 1.0;
  public ditheringType = 'errorDiffusion';
  public errorDiffusionMatrix = 'floydSteinberg';
  public serpentine = false;
  public palette = 'aitjcizeSpectra6Palette';
  public processingPreset: '' | 'balanced' | 'dynamic' | 'vivid' | 'soft' | 'greyscale' = '';

  public detailsOpen = true;
  public propertiesOpen = false;
  
  private _updateTimer: any = null;

  public initialise(image?: ImageMetadata) {
    this.editingImage = image || null;
    this.uploadedImage = image || null;
    this.isUploading = false;
    this.error = null;
    this.keywords = image?.keywords || [];
    this.imageName = image?.name || '';
    this.artist = image?.artist || '';
    this.collection = image?.collection || '';
    this.description = image?.description || '';
    this.brightness = image?.brightness ?? 1.0;
    this.contrast = image?.contrast ?? 1.0;
    this.saturation = image?.saturation ?? 1.0;
    this.ditheringType = image?.conversion?.ditheringType || 'errorDiffusion';
    this.errorDiffusionMatrix = image?.conversion?.errorDiffusionMatrix || 'floydSteinberg';
    this.serpentine = image?.conversion?.serpentine ?? false;
    this.palette = 'aitjcizeSpectra6Palette';
    this.processingPreset = (image?.conversion?.processingPreset as any) || '';

    this.detailsOpen = true;
    this.propertiesOpen = false;
    this.triggerUpdate();
  }

  public toggleSection(section: 'details' | 'properties') {
    if (section === 'details') {
      this.detailsOpen = !this.detailsOpen;
      this.propertiesOpen = !this.detailsOpen;
    } else {
      this.propertiesOpen = !this.propertiesOpen;
      this.detailsOpen = !this.propertiesOpen;
    }
    
    if (this.propertiesOpen) {
      setTimeout(() => this.triggerUpdate(), 300);
    }
    this.host.requestUpdate();
  }

  public async processFile(file: File) {
    this.isUploading = true;
    this.error = null;
    this.host.requestUpdate();
    try {
      const result = await api.uploadImage(file);
      this.uploadedImage = result;
      this.imageName = result.name;
    } catch (err: any) {
      this.error = err.message || 'Failed to upload image';
      console.error('Upload error:', err);
    } finally {
      this.isUploading = false;
      this.host.requestUpdate();
    }
  }

  public async save() {
    if (!this.uploadedImage || !this.imageName.trim()) return;

    this.isUploading = true;
    this.error = null;
    this.host.requestUpdate();
    try {
      const metadata = {
        name: this.imageName,
        artist: this.artist,
        collection: this.collection,
        description: this.description,
        keywords: this.keywords,
        brightness: this.brightness,
        contrast: this.contrast,
        saturation: this.saturation,
        conversion: {
          ditheringType: this.ditheringType as any,
          errorDiffusionMatrix: this.errorDiffusionMatrix as any,
          serpentine: this.serpentine,
          processingPreset: this.processingPreset
        }
      };

      if (this.editingImage) {
        await api.updateImage(this.editingImage.id, { ...this.editingImage, ...metadata });
      } else {
        await api.updateImage(this.uploadedImage.id, { ...this.uploadedImage, ...metadata });
      }
      
      this.host.dispatchEvent(new CustomEvent('image-saved', {
        bubbles: true,
        composed: true
      }));
      
      this.uploadedImage = null;
      this.editingImage = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to save image metadata';
      console.error('Save error:', err);
    } finally {
      this.isUploading = false;
      this.host.requestUpdate();
    }
  }

  public async cancel() {
    if (!this.editingImage && this.uploadedImage) {
      try {
        await api.deleteItem('image', this.uploadedImage.id);
      } catch (err) {
        console.error('Failed to cleanup uploaded image:', err);
      }
    }
    this.uploadedImage = null;
    this.editingImage = null;
  }

  public triggerUpdate() {
    if (this._updateTimer) {
      clearTimeout(this._updateTimer);
    }
    this._updateTimer = setTimeout(() => this.updatePreview(), 150);
  }

  private async updatePreview() {
    const canvas = (this.host as any)._canvas as HTMLCanvasElement;
    const sourceImg = (this.host as any)._sourceImg as HTMLImageElement;
    if (!sourceImg || !canvas || !this.uploadedImage) return;
    if (!sourceImg.complete || sourceImg.naturalWidth === 0) return;

    const tempCanvas = this.prepareAdjustedCanvas(sourceImg);
    if (!tempCanvas) return;

    const paletteName = this.palette === 'defaultPalette' ? 'default' : 
                       this.palette === 'aitjcizeSpectra6Palette' ? 'spectra6' : 
                       this.palette === 'acepPalette' ? 'acep' : 'spectra6';

    const options = {
      ditheringType: this.ditheringType,
      errorDiffusionMatrix: this.errorDiffusionMatrix,
      serpentine: this.serpentine,
      palette: getDefaultPalettes(paletteName),
      processingPreset: this.processingPreset
    };

    try {
      await ditherImage(tempCanvas, canvas, options as any);
    } catch (err) {
      console.error('Dithering error:', err);
    }
  }

  private prepareAdjustedCanvas(sourceImg: HTMLImageElement): HTMLCanvasElement | null {
    const width = sourceImg.naturalWidth;
    const height = sourceImg.naturalHeight;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    ctx.filter = `brightness(${this.brightness}) contrast(${this.contrast}) saturate(${this.saturation})`;
    ctx.drawImage(sourceImg, 0, 0);
    ctx.filter = 'none';

    return tempCanvas;
  }

  public async suggestSettings() {
    const sourceImg = (this.host as any)._sourceImg as HTMLImageElement;
    if (!sourceImg || !this.uploadedImage) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceImg.naturalWidth;
    tempCanvas.height = sourceImg.naturalHeight;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(sourceImg, 0, 0);

    const paletteName = this.palette === 'defaultPalette' ? 'default' : 
                       this.palette === 'aitjcizeSpectra6Palette' ? 'spectra6' : 
                       this.palette === 'acepPalette' ? 'acep' : 'spectra6';
    
    const palette = getDefaultPalettes(paletteName);

    try {
      const suggestion = suggestCanvasProcessingOptions(tempCanvas, palette as any);
      if (suggestion && suggestion.ditherOptions) {
        const opts = suggestion.ditherOptions;
        if (opts.ditheringType) this.ditheringType = opts.ditheringType;
        if (opts.errorDiffusionMatrix) this.errorDiffusionMatrix = opts.errorDiffusionMatrix;
        if (opts.processingPreset) this.processingPreset = opts.processingPreset as any;

        if (opts.toneMapping) {
          if (opts.toneMapping.exposure !== undefined) this.brightness = opts.toneMapping.exposure;
          if (opts.toneMapping.contrast !== undefined) this.contrast = opts.toneMapping.contrast;
          if (opts.toneMapping.saturation !== undefined) this.saturation = opts.toneMapping.saturation;
        }

        this.triggerUpdate();
        this.host.requestUpdate();
      }
    } catch (err) {
      console.error('Suggestion error:', err);
    }
  }
}
