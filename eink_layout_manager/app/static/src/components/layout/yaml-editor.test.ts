import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import './components/layout/yaml-editor';
import { YamlEditor } from './components/layout/yaml-editor';

describe('YamlEditor', () => {
  let element: YamlEditor;
  const mockData = {
    name: 'Test Layout',
    canvas_width_mm: 500,
    items: [
      { id: '1', x_mm: 10 }
    ]
  };

  beforeEach(async () => {
    element = await fixture(html`
      <yaml-editor .data="${mockData}" .schemaName="${'Layout'}"></yaml-editor>
    `);
  });

  it('should initialize with YAML representation of data', () => {
    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea?.value).toContain('name: Test Layout');
    expect(textarea?.value).toContain('canvas_width_mm: 500');
  });

  it('should strip internal properties from YAML', async () => {
    const dataWithInternal = {
      ...mockData,
      invalid: true,
      _metadata: 'internal'
    };
    element.data = dataWithInternal;
    await element.updateComplete;
    
    const yamlText = element.shadowRoot?.querySelector('textarea')?.value;
    expect(yamlText).not.toContain('invalid: true');
    expect(yamlText).not.toContain('_metadata');
  });

  it('should emit data-update event when valid YAML is entered', async () => {
    const updateSpy = vi.fn();
    element.addEventListener('data-update', updateSpy);
    
    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'name: Updated Name\ncanvas_width_mm: 600';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ name: 'Updated Name', canvas_width_mm: 600 })
    }));
    expect((element as any)._errorMessage).toBe('');
  });

  it('should show error message for invalid YAML', async () => {
    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'name: [unclosed bracket';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    await element.updateComplete;
    expect((element as any)._errorMessage).not.toBe('');
    const status = element.shadowRoot?.querySelector('.status-item.error');
    expect(status).to.exist;
  });

  it('should show error for non-object YAML', async () => {
    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Just a string, not an object';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    await element.updateComplete;
    expect((element as any)._errorMessage).toBe('Invalid YAML structure');
  });

  it('should detect logical equality in YAML to prevent unnecessary updates', () => {
      const y1 = 'name: Test\nwidth: 10';
      const y2 = 'width: 10\nname: Test';
      
      expect((element as any)._isYamlEqual(y1, y2)).toBe(true);
      expect((element as any)._isYamlEqual(y1, 'name: Other')).toBe(false);
  });
});
