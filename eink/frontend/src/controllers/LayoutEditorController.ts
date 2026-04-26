import interact from 'interactjs';
import { DisplayType, LayoutItem } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

/**
 * Controller for the Layout Editor.
 * Manages layout item positions, scaling, interactions, and validation.
 */
export class LayoutEditorController extends BaseViewController {
  public width_mm = 500;
  public height_mm = 500;
  public gridSnap = 5;
  public items: LayoutItem[] = [];
  public displayTypes: DisplayType[] = [];
  public selectedIds: string[] = [];
  public highlightedIds: string[] = [];
  public usedIds: string[] = [];
  public readOnly = false;
  public noPadding = false;
  public hideNumber = false;
  public previewImage: HTMLCanvasElement | string | null = null;
  public previewTotalSize: { width: number; height: number } = { width: 0, height: 0 };
  public scale = 1;
  public invalidItemIds = new Set<string>();

  public initialise(props: Partial<LayoutEditorController>) {
    Object.assign(this, props);
    this.updateScale();
    this.validateLayout();
  }

  public updateScale(rect?: { width: number; height: number }) {
    if (!rect) {
      const bcr = (this.host as any).getBoundingClientRect();
      rect = { width: bcr.width, height: bcr.height };
    }

    const padding = this.noPadding ? 0 : 80;
    const availableWidth = Math.max(0, rect.width - padding);
    const availableHeight = Math.max(0, rect.height - padding);
    
    if (availableWidth > 0 && availableHeight > 0) {
      const scaleX = availableWidth / this.width_mm;
      const scaleY = availableHeight / this.height_mm;
      const newScale = Math.min(scaleX, scaleY, 4);
      
      if (Math.abs(this.scale - newScale) > 0.001) {
        this.scale = newScale;
        this.host.requestUpdate();
      }
    }
  }

  public setupInteractions(shadowRoot: ShadowRoot) {
    const canvas = shadowRoot.querySelector('.canvas') as HTMLElement;
    if (!canvas) return;

    interact(canvas).unset();
    interact('layout-box', { context: shadowRoot as any }).unset();

    if (this.readOnly) return;

    interact('layout-box', { context: shadowRoot as any })
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true }),
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: this.gridSnap, y: this.gridSnap })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          })
        ],
        listeners: {
          move: (event: any) => {
            const target = event.target;
            const id = target.getAttribute('data-id');
            const item = this.items.find(i => i.id === id);
            
            if (item) {
              const dx = event.dx / this.scale;
              const dy = event.dy / this.scale;
              item.x_mm = Math.round((item.x_mm + dx) / this.gridSnap) * this.gridSnap;
              item.y_mm = Math.round((item.y_mm + dy) / this.gridSnap) * this.gridSnap;
              this.validateLayout();
              this.host.requestUpdate();
            }
          },
          end: (event: any) => {
             const id = event.target.getAttribute('data-id');
             const item = this.items.find(i => i.id === id);
             if (item) {
                this.host.dispatchEvent(new CustomEvent('item-moved', {
                  detail: { id, x: item.x_mm, y: item.y_mm }
                }));
             }
          }
        }
      });

    interact(canvas)
      .resizable({
        edges: { right: true, bottom: true },
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: this.gridSnap, y: this.gridSnap })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
          }),
          interact.modifiers.restrictSize({ min: { width: 100, height: 100 } })
        ],
        listeners: {
          start: () => canvas.classList.add('resizing'),
          move: (event: any) => {
            this.width_mm = Math.round(event.rect.width / this.scale / this.gridSnap) * this.gridSnap;
            this.height_mm = Math.round(event.rect.height / this.scale / this.gridSnap) * this.gridSnap;
            this.updateScale();
            this.validateLayout();
            this.host.requestUpdate();
          },
          end: () => {
            canvas.classList.remove('resizing');
            this.host.dispatchEvent(new CustomEvent('layout-resized', {
              detail: { width: this.width_mm, height: this.height_mm }
            }));
          }
        }
      });
  }

  public validateLayout() {
    const newInvalidIds = new Set<string>();
    for (let i = 0; i < this.items.length; i++) {
      const item1 = this.items[i];
      const dt1 = this.displayTypes.find(t => t.id === item1.display_type_id);
      if (!dt1) continue;
      const isPortrait1 = item1.orientation === 'portrait';
      const w1 = isPortrait1 ? dt1.height_mm : dt1.width_mm;
      const h1 = isPortrait1 ? dt1.width_mm : dt1.height_mm;

      if (item1.x_mm < 0 || item1.y_mm < 0 || item1.x_mm + w1 > this.width_mm || item1.y_mm + h1 > this.height_mm) {
        newInvalidIds.add(item1.id);
      }
      for (let j = i + 1; j < this.items.length; j++) {
        const item2 = this.items[j];
        const dt2 = this.displayTypes.find(t => t.id === item2.display_type_id);
        if (!dt2) continue;
        const isPortrait2 = item2.orientation === 'portrait';
        const w2 = isPortrait2 ? dt2.height_mm : dt2.width_mm;
        const h2 = isPortrait2 ? dt2.width_mm : dt2.height_mm;

        if (item1.x_mm < item2.x_mm + w2 && item1.x_mm + w1 > item2.x_mm &&
            item1.y_mm < item2.y_mm + h2 && item1.y_mm + h1 > item2.y_mm) {
          newInvalidIds.add(item1.id);
          newInvalidIds.add(item2.id);
        }
      }
    }
    
    let changed = false;
    if (this.invalidItemIds.size !== newInvalidIds.size) {
      changed = true;
    } else {
      for (const id of newInvalidIds) {
        if (!this.invalidItemIds.has(id)) {
           changed = true;
           break;
        }
      }
    }
    if (changed) {
      this.invalidItemIds = newInvalidIds;
      this.host.requestUpdate();
    }
  }

  public handleBoxSelect(id: string) {
    if (this.readOnly) {
      this.host.dispatchEvent(new CustomEvent('box-click', { detail: { id } }));
      if (this.usedIds.includes(id)) return;
      const newSelectedIds = this.selectedIds.includes(id)
        ? this.selectedIds.filter(i => i !== id)
        : [...this.selectedIds, id];
      this.host.dispatchEvent(new CustomEvent('selection-change', { detail: { ids: newSelectedIds } }));
    } else {
      this.host.dispatchEvent(new CustomEvent('select-item', { detail: { id } }));
    }
  }

  public handleMouseMove(e: MouseEvent, shadowRoot: ShadowRoot) {
    const canvas = shadowRoot.querySelector('.canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.scale;
    const y = (e.clientY - rect.top) / this.scale;
    this.host.dispatchEvent(new CustomEvent('mouse-move', { detail: { x: Math.round(x), y: Math.round(y) } }));
  }

  public handleMouseLeave() {
    this.host.dispatchEvent(new CustomEvent('mouse-move', { detail: { x: null, y: null } }));
  }
}
