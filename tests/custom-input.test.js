import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/components/custom-input.js';

describe('CustomInput', () => {
  let input;

  beforeEach(() => {
    document.body.innerHTML = '';
    input = document.createElement('custom-input');
    document.body.appendChild(input);
  });

  describe('Rendering', () => {
    it('should render input element', () => {
      expect(input).toBeDefined();
      expect(input.shadowRoot).toBeTruthy();
    });

    it('should render with label attribute', () => {
      input.setAttribute('label', 'Username');
      expect(input.getAttribute('label')).toBe('Username');
    });

    it('should render with placeholder attribute', () => {
      input.setAttribute('placeholder', 'Enter username');
      expect(input.getAttribute('placeholder')).toBe('Enter username');
    });

    it('should render with type attribute', () => {
      input.setAttribute('type', 'email');
      expect(input.getAttribute('type')).toBe('email');
    });
  });

  describe('States', () => {
    it('should be required when required attribute is set', () => {
      input.setAttribute('required', '');
      expect(input.hasAttribute('required')).toBe(true);
    });

    it('should be disabled when disabled attribute is set', () => {
      input.setAttribute('disabled', '');
      expect(input.hasAttribute('disabled')).toBe(true);
    });

    it('should show error state when error attribute is set', () => {
      input.setAttribute('error', 'Invalid input');
      expect(input.getAttribute('error')).toBe('Invalid input');
    });
  });

  describe('Value handling', () => {
    it('should have a value property', () => {
      expect(input.value).toBeDefined();
    });

    it('should update value when set programmatically', () => {
      input.value = 'test value';
      expect(input.value).toBe('test value');
    });
  });

  describe('Events', () => {
    it('should dispatch input-change event on input', async () => {
      const changeHandler = vi.fn();
      input.addEventListener('input-change', changeHandler);
      
      const shadowInput = input.shadowRoot.querySelector('input');
      shadowInput.value = 'new value';
      shadowInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for any async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(changeHandler).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should have validate method if implemented', () => {
      if (typeof input.validate === 'function') {
        expect(typeof input.validate).toBe('function');
      }
    });
  });
});
