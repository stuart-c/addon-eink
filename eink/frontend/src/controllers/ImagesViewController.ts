import { Image, api } from '../services/HaApiClient';
import { BaseViewController } from './BaseViewController';

export type SortField = 'name' | 'artist' | 'collection' | 'width' | 'height';

export interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

/**
 * Controller for the Images View.
 * Manages filtering, sorting, and image management.
 */
export class ImagesViewController extends BaseViewController {
  public filterTitle = '';
  public filterDescription = '';
  public filterArtist = '';
  public filterCollection = '';
  public minWidth = 0;
  public maxWidth = 4000;
  public minHeight = 0;
  public maxHeight = 4000;
  public keywords: string[] = [];
  public sortFields: SortConfig[] = [{ field: 'name', direction: 'asc' }];
  public isAddMenuOpen = false;
  
  private _debounceTimer: any = null;

  public triggerFilterChange(immediate = false) {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    const trigger = () => {
      const sort = this.sortFields
        .map(s => `${s.field}:${s.direction}`)
        .join(',');

      const filters = {
        title: this.filterTitle,
        description: this.filterDescription,
        artist: this.filterArtist,
        collection: this.filterCollection,
        min_width: this.minWidth > 0 ? this.minWidth : undefined,
        max_width: this.maxWidth < 4000 ? this.maxWidth : undefined,
        min_height: this.minHeight > 0 ? this.minHeight : undefined,
        max_height: this.maxHeight < 4000 ? this.maxHeight : undefined,
        keyword: this.keywords.length > 0 ? this.keywords.join(',') : undefined,
        sort: sort || undefined
      };

      this.host.dispatchEvent(new CustomEvent('filter-change', {
        detail: filters,
        bubbles: true,
        composed: true
      }));
    };

    if (immediate) {
      trigger();
    } else {
      this._debounceTimer = setTimeout(trigger, 300);
    }
  }

  public resetFilters() {
    this.filterTitle = '';
    this.filterDescription = '';
    this.filterArtist = '';
    this.filterCollection = '';
    this.minWidth = 0;
    this.maxWidth = 4000;
    this.minHeight = 0;
    this.maxHeight = 4000;
    this.keywords = [];
    this.sortFields = [{ field: 'name', direction: 'asc' }];
    this.isAddMenuOpen = false;
    this.triggerFilterChange(true);
    this.host.requestUpdate();
  }

  public addSortField(field: SortField) {
    this.sortFields = [...this.sortFields, { field, direction: 'asc' }];
    this.isAddMenuOpen = false;
    this.triggerFilterChange(true);
    this.host.requestUpdate();
  }

  public removeSortField(index: number) {
    this.sortFields = this.sortFields.filter((_, i) => i !== index);
    this.triggerFilterChange(true);
    this.host.requestUpdate();
  }

  public toggleSortDirection(index: number) {
    const newFields = [...this.sortFields];
    newFields[index] = {
      ...newFields[index],
      direction: newFields[index].direction === 'asc' ? 'desc' : 'asc'
    };
    this.sortFields = newFields;
    this.triggerFilterChange(true);
    this.host.requestUpdate();
  }

  public reorderSortFields(fromIndex: number, toIndex: number) {
    const newFields = [...this.sortFields];
    const item = newFields.splice(fromIndex, 1)[0];
    newFields.splice(toIndex, 0, item);
    this.sortFields = newFields;
    this.triggerFilterChange(true);
    this.host.requestUpdate();
  }

  public async deleteImage(image: Image) {
    this.host.dispatchEvent(new CustomEvent('request-confirmation', {
      detail: {
        config: {
          title: 'Delete Image?',
          message: `Are you sure you want to delete "${image.name}"? This cannot be undone.`,
          confirmText: 'Delete',
          type: 'danger'
        },
        callback: async (confirmed: boolean) => {
          if (confirmed) {
            try {
              await api.deleteItem('image', image.id);
              this.state.refresh();
              this.showMessage('Image deleted successfully', 'success');
            } catch (err: any) {
              this.showMessage(err.message || 'Failed to delete image', 'error');
            }
          }
        }
      },
      bubbles: true,
      composed: true
    }));
  }
}
