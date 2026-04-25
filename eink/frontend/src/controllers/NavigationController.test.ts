import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavigationController } from './NavigationController';

describe('NavigationController', () => {
    let controller: NavigationController;
    let mockHost: any;

    beforeEach(() => {
        mockHost = {
            addController: vi.fn(),
            requestUpdate: vi.fn()
        };
        // Mock window.location.hash
        window.location.hash = '';
        controller = new NavigationController(mockHost);
    });

    it('initialises with default values', () => {
        expect(controller.activeSection).toBe('layouts');
        expect(controller.viewMode).toBe('graphical');
    });

    it('sets section and updates hash', () => {
        controller.setSection('images');
        expect(controller.activeSection).toBe('images');
        expect(window.location.hash).toBe('#/images');
        expect(mockHost.requestUpdate).toHaveBeenCalled();
    });

    it('sets view mode and updates hash', () => {
        controller.setViewMode('yaml');
        expect(controller.viewMode).toBe('yaml');
        expect(window.location.hash).toBe('#/layouts?mode=yaml');
    });

    it('selects layout and updates hash', () => {
        controller.selectLayout('l123');
        expect(controller.activeLayoutId).toBe('l123');
        expect(window.location.hash).toBe('#/layouts/l123');
    });

    it('selects item within layout and updates hash', () => {
        controller.selectLayout('l123');
        controller.selectItem('i456');
        expect(controller.selectedItemId).toBe('i456');
        expect(window.location.hash).toBe('#/layouts/l123/item/i456');
    });

    it('applies values from hash', () => {
        window.location.hash = '#/scenes/s789?mode=yaml';
        // Trigger _applyHash manually since we're bypassing event listener
        (controller as any)._applyHash();
        
        expect(controller.activeSection).toBe('scenes');
        expect(controller.activeSceneId).toBe('s789');
        expect(controller.viewMode).toBe('yaml');
    });
});
