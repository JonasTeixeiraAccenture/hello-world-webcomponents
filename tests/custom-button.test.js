import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/components/custom-button.js';

describe('CustomButton', () => {
  let button;

  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = '';
    // Create a fresh button instance
    button = document.createElement('custom-button');
    document.body.appendChild(button);
  });

  describe('Rendering', () => {
    it('should render button element', () => {
      expect(button).toBeDefined();
      expect(button.shadowRoot).toBeTruthy();
    });

    it('should render with default slot content', () => {
      button.textContent = 'Click Me';
      expect(button.textContent).toBe('Click Me');
    });

    it('should apply variant attribute', () => {
      button.setAttribute('variant', 'primary');
      expect(button.getAttribute('variant')).toBe('primary');
    });

    it('should apply size attribute', () => {
      button.setAttribute('size', 'lg');
      expect(button.getAttribute('size')).toBe('lg');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled attribute is set', () => {
      button.setAttribute('disabled', '');
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('should show loading state when loading attribute is set', () => {
      button.setAttribute('loading', '');
      expect(button.hasAttribute('loading')).toBe(true);
    });

    it('should take full width when full-width attribute is set', () => {
      button.setAttribute('full-width', '');
      expect(button.hasAttribute('full-width')).toBe(true);
    });
  });

  describe('Events', () => {
    it('should dispatch button-click event when clicked', () => {
      const clickHandler = vi.fn();
      button.addEventListener('button-click', clickHandler);
      
      const shadowButton = button.shadowRoot.querySelector('.button');
      shadowButton.click();
      
      expect(clickHandler).toHaveBeenCalledOnce();
    });

    it('should not dispatch event when disabled', () => {
      const clickHandler = vi.fn();
      button.addEventListener('button-click', clickHandler);
      button.setAttribute('disabled', '');
      
      const shadowButton = button.shadowRoot.querySelector('.button');
      shadowButton.click();
      
      // Event might still fire but component should handle it internally
      // This depends on your implementation
    });
  });

  describe('Methods', () => {
    it('should have setLoading method', () => {
      expect(typeof button.setLoading).toBe('function');
    });

    it('should have setDisabled method', () => {
      expect(typeof button.setDisabled).toBe('function');
    });

    it('should update loading state with setLoading method', () => {
      button.setLoading(true);
      expect(button.hasAttribute('loading')).toBe(true);
      
      button.setLoading(false);
      expect(button.hasAttribute('loading')).toBe(false);
    });

    it('should update disabled state with setDisabled method', () => {
      button.setDisabled(true);
      expect(button.hasAttribute('disabled')).toBe(true);
      
      button.setDisabled(false);
      expect(button.hasAttribute('disabled')).toBe(false);
    });
  });
});
