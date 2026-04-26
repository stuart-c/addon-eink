import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { KeywordInput } from './keyword-input';
import './keyword-input';
import { api } from '../../services/HaApiClient';

// Mock the API singleton
vi.mock('../../services/HaApiClient', () => {
  return {
    api: {
      getKeywords: vi.fn(),
    },
  };
});

describe('KeywordInput', () => {
  let element: KeywordInput;

  const mockKeywords = [
    { keyword: 'nature', count: 10 },
    { keyword: 'portrait', count: 5 }
  ];

  beforeEach(async () => {
    vi.mocked(api.getKeywords).mockResolvedValue(mockKeywords);
    element = document.createElement('keyword-input') as KeywordInput;
    element.keywords = ['nature'];
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it('should render existing keyword chips', () => {
    const chips = element.shadowRoot?.querySelectorAll('.keyword-chip');
    expect(chips?.length).toBe(1);
    expect(chips?.[0].textContent).toContain('nature');
  });

  it('should characterize chips as valid or invalid when validation is enabled', async () => {
    element.validate = true;
    element.keywords = ['nature', 'unknown'];
    await element.updateComplete;
    
    const chips = element.shadowRoot?.querySelectorAll('.keyword-chip');
    expect(chips?.[0].classList.contains('invalid')).toBe(false);
    expect(chips?.[1].classList.contains('invalid')).toBe(true);
    expect(chips?.[1].querySelector('.invalid-icon')).toBeTruthy();
  });

  it('should not show validation when disabled', async () => {
    element.validate = false;
    element.keywords = ['unknown'];
    await element.updateComplete;
    
    const chip = element.shadowRoot?.querySelector('.keyword-chip');
    expect(chip?.classList.contains('invalid')).toBe(false);
  });

  it('should fetch keywords on connect', () => {
    expect(api.getKeywords).toHaveBeenCalled();
  });
});
