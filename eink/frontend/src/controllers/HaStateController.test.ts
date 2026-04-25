import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HaStateController } from './HaStateController';

describe('HaStateController', () => {
    let controller: HaStateController;
    let mockHost: any;

    beforeEach(() => {
        mockHost = {
            addController: vi.fn(),
            requestUpdate: vi.fn()
        };
        const mockNavigation = {
            activeSection: 'layouts',
            viewMode: 'graphical',
            selectedItemId: null,
            selectedImageId: null,
            selectedDisplayTypeId: null,
            activeSceneId: null,
            isAddingNew: false,
            activeLayoutId: null,
            setSection: vi.fn().mockImplementation(function(this: any, s: any) { 
                this.activeSection = s;
                mockHost.requestUpdate();
            }),
            setViewMode: vi.fn().mockImplementation(function(this: any, m: any) { 
                this.viewMode = m;
                mockHost.requestUpdate();
            }),
            selectItem: vi.fn(),
            selectImage: vi.fn(),
            selectDisplayType: vi.fn(),
            selectScene: vi.fn(),
            updateHash: vi.fn()
        };
        controller = new HaStateController(mockHost, mockNavigation as any);
    });

    it('initializes with default values', () => {
        expect(controller.activeSection).toBe('layouts');
        expect(controller.connected).toBe(false);
        expect(controller.viewMode).toBe('graphical');
    });

    it('switches sections correctly', () => {
        controller.setSection('images');
        expect(controller.activeSection).toBe('images');
        expect(mockHost.requestUpdate).toHaveBeenCalled();
    });

    it('detects dirty state when layout changes', () => {
        const layout = { id: 'l1', name: 'Original', items: [] };
        controller.activeLayout = layout as any;
        (controller as any)._originalLayout = JSON.stringify(layout);

        expect(controller.isDirty).toBe(false);

        controller.activeLayout = { ...layout, name: 'Modified' } as any;
        expect(controller.isDirty).toBe(true);
    });

    it('toggles view mode', () => {
        controller.setViewMode('yaml');
        expect(controller.viewMode).toBe('yaml');
        controller.setViewMode('graphical');
        expect(controller.viewMode).toBe('graphical');
    });
});
