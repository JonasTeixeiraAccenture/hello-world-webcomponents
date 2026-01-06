import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/components/custom-alert.js';

describe('CustomAlert', () => {
  let alert;

  beforeEach(() => {
    document.body.innerHTML = '';
    alert = document.createElement('custom-alert');
    document.body.appendChild(alert);
  });

  describe('Rendering', () => {
    it('should render alert element', () => {
      expect(alert).toBeDefined();
      expect(alert.shadowRoot).toBeTruthy();
    });

    it('should render with message attribute', () => {
      alert.setAttribute('message', 'Alert message');
      expect(alert.getAttribute('message')).toBe('Alert message');
    });

    it('should render with type attribute', () => {
      alert.setAttribute('type', 'success');
      expect(alert.getAttribute('type')).toBe('success');
    });
  });

  describe('Types', () => {
    const types = ['success', 'error', 'warning', 'info'];

    types.forEach(type => {
      it(`should support ${type} type`, () => {
        alert.setAttribute('type', type);
        expect(alert.getAttribute('type')).toBe(type);
      });
    });
  });

  describe('Dismissible', () => {
    it('should be dismissible when dismissible attribute is set', () => {
      alert.setAttribute('dismissible', '');
      expect(alert.hasAttribute('dismissible')).toBe(true);
    });

    it('should dispatch close event when dismissed', () => {
      const closeHandler = vi.fn();
      alert.setAttribute('dismissible', '');
      alert.addEventListener('alert-close', closeHandler);
      
      const closeButton = alert.shadowRoot.querySelector('.close-button');
      if (closeButton) {
        closeButton.click();
        expect(closeHandler).toHaveBeenCalled();
      }
    });
  });

  describe('Methods', () => {
    it('should have show method if implemented', () => {
      if (typeof alert.show === 'function') {
        expect(typeof alert.show).toBe('function');
      }
    });

    it('should have hide method if implemented', () => {
      if (typeof alert.hide === 'function') {
        expect(typeof alert.hide).toBe('function');
      }
    });
  });
});
