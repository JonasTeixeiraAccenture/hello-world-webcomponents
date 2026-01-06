import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/custom-card.js';

describe('CustomCard', () => {
  let card;

  beforeEach(() => {
    document.body.innerHTML = '';
    card = document.createElement('custom-card');
    document.body.appendChild(card);
  });

  describe('Rendering', () => {
    it('should render card element', () => {
      expect(card).toBeDefined();
      expect(card.shadowRoot).toBeTruthy();
    });

    it('should render with title attribute', () => {
      card.setAttribute('title', 'Card Title');
      expect(card.getAttribute('title')).toBe('Card Title');
    });

    it('should accept slot content', () => {
      card.innerHTML = '<p>Card content</p>';
      expect(card.innerHTML).toContain('Card content');
    });
  });

  describe('Styling', () => {
    it('should apply variant attribute if supported', () => {
      card.setAttribute('variant', 'elevated');
      expect(card.hasAttribute('variant')).toBe(true);
    });

    it('should apply padding attribute if supported', () => {
      card.setAttribute('padding', 'lg');
      expect(card.getAttribute('padding')).toBe('lg');
    });
  });

  describe('Shadow DOM', () => {
    it('should have shadow root', () => {
      expect(card.shadowRoot).not.toBeNull();
    });

    it('should contain card wrapper in shadow DOM', () => {
      const cardElement = card.shadowRoot.querySelector('.card');
      expect(cardElement).toBeTruthy();
    });
  });
});
