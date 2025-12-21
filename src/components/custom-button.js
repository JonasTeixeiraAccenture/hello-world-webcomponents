/**
 * CustomButton Web Component
 * 
 * A flexible button component with multiple variants, sizes, and states.
 * 
 * @element custom-button
 * 
 * @slot default - Button label text
 * @slot icon-left - Icon before text
 * @slot icon-right - Icon after text
 * 
 * @attr {string} variant - Button style: 'primary', 'secondary', 'success', 'error', 'outline', 'ghost'
 * @attr {string} size - Button size: 'sm', 'md', 'lg'
 * @attr {boolean} disabled - Whether the button is disabled
 * @attr {boolean} loading - Whether the button shows loading state
 * @attr {boolean} full-width - Whether button takes full width
 * 
 * @fires button-click - Dispatched when button is clicked
 * 
 * @method setLoading(isLoading) - Programmatically set loading state
 * @method setDisabled(isDisabled) - Programmatically set disabled state
 * 
 * @example
 * <custom-button variant="primary" size="md">
 *   Click Me
 * </custom-button>
 */

// Create HTML template once
const buttonTemplate = document.createElement('template');
buttonTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
    }

    .button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-medium);
      border: 2px solid transparent;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      white-space: nowrap;
      user-select: none;
    }

    :host([full-width]) .button {
      width: 100%;
    }

    /* Sizes */
    .button.size-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    .button.size-md {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-base);
    }

    .button.size-lg {
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: var(--font-size-lg);
    }

    /* Primary Variant */
    .button.variant-primary {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }

    .button.variant-primary:hover:not(:disabled) {
      background: var(--color-primary-dark);
      border-color: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    /* Secondary Variant */
    .button.variant-secondary {
      background: var(--color-secondary);
      color: white;
      border-color: var(--color-secondary);
    }

    .button.variant-secondary:hover:not(:disabled) {
      background: var(--color-secondary-dark);
      border-color: var(--color-secondary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    /* Success Variant */
    .button.variant-success {
      background: var(--color-success);
      color: white;
      border-color: var(--color-success);
    }

    .button.variant-success:hover:not(:disabled) {
      background: var(--color-success-dark);
      border-color: var(--color-success-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    /* Error Variant */
    .button.variant-error {
      background: var(--color-error);
      color: white;
      border-color: var(--color-error);
    }

    .button.variant-error:hover:not(:disabled) {
      background: var(--color-error-dark);
      border-color: var(--color-error-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    /* Outline Variant */
    .button.variant-outline {
      background: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .button.variant-outline:hover:not(:disabled) {
      background: var(--color-primary);
      color: white;
      transform: translateY(-1px);
    }

    /* Ghost Variant */
    .button.variant-ghost {
      background: transparent;
      color: var(--color-text-primary);
      border-color: transparent;
    }

    .button.variant-ghost:hover:not(:disabled) {
      background: var(--color-background);
      border-color: var(--color-border);
    }

    /* Disabled State */
    .button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Loading State */
    .button.loading {
      pointer-events: none;
    }

    .button-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      transition: opacity 0.2s;
    }

    .button.loading .button-content {
      opacity: 0.5;
    }

    .loading-spinner {
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: none;
    }

    .button.loading .loading-spinner {
      display: block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .button:active:not(:disabled):not(.loading) {
      transform: scale(0.98);
    }
  </style>

  <button class="button" part="button">
    <span class="loading-spinner"></span>
    <span class="button-content">
      <slot name="icon-left"></slot>
      <slot></slot>
      <slot name="icon-right"></slot>
    </span>
  </button>
`;

class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clone template
    this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
    
    // Cache DOM references
    this._button = this.shadowRoot.querySelector('.button');
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'full-width'];
  }

  connectedCallback() {
    this.updateFromAttributes();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._button) {
      this.updateAttribute(name, newValue);
    }
  }

  updateAttribute(name, value) {
    switch (name) {
      case 'variant':
        this.updateClasses();
        break;
      case 'size':
        this.updateClasses();
        break;
      case 'disabled':
        this._button.disabled = this.hasAttribute('disabled');
        break;
      case 'loading':
        this.updateClasses();
        break;
      case 'full-width':
        // Handled by :host([full-width]) CSS
        break;
    }
  }

  updateClasses() {
    this._button.className = `button variant-${this.variant} size-${this.size} ${this.loading ? 'loading' : ''}`;
  }

  updateFromAttributes() {
    this.updateClasses();
    this._button.disabled = this.disabled;
  }

  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  set variant(value) {
    this.setAttribute('variant', value);
  }

  get size() {
    return this.getAttribute('size') || 'md';
  }

  set size(value) {
    this.setAttribute('size', value);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get loading() {
    return this.hasAttribute('loading');
  }

  set loading(value) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  setLoading(isLoading) {
    this.loading = isLoading;
  }

  setDisabled(isDisabled) {
    this.disabled = isDisabled;
  }

  attachEventListeners() {
    this._button.addEventListener('click', (e) => {
      if (!this.disabled && !this.loading) {
        this.dispatchEvent(new CustomEvent('button-click', {
          bubbles: true,
          composed: true,
          detail: {
            event: e
          }
        }));
      }
    });
  }
}

customElements.define('custom-button', CustomButton);

export default CustomButton;
