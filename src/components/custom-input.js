/**
 * CustomInput Web Component
 * 
 * A flexible input field with validation states and helper text.
 * Supports various input types and styling options.
 * 
 * @element custom-input
 * 
 * @slot - No slots (controlled component)
 * 
 * @attr {string} label - Input label text
 * @attr {string} type - Input type (text, email, password, etc.)
 * @attr {string} placeholder - Placeholder text
 * @attr {string} value - Input value
 * @attr {boolean} required - Whether the input is required
 * @attr {boolean} disabled - Whether the input is disabled
 * @attr {string} error-message - Error message to display
 * @attr {string} helper-text - Helper text below the input
 * 
 * @fires input-change - Dispatched when the input value changes
 * @fires input-focus - Dispatched when the input gains focus
 * @fires input-blur - Dispatched when the input loses focus
 * @fires validation-change - Dispatched when validation state changes
 * 
 * @example
 * <custom-input 
 *   label="Email" 
 *   type="email" 
 *   required 
 *   helper-text="Enter your email address">
 * </custom-input>
 */

// Create HTML template once (parsed only once for performance)
const inputTemplate = document.createElement('template');
inputTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
      font-family: var(--font-family-base);
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      transition: color 0.2s;
    }

    .input-container {
      position: relative;
    }

    .input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-base);
      font-family: inherit;
      border: 2px solid var(--color-border);
      border-radius: var(--border-radius-md);
      background: var(--color-surface);
      color: var(--color-text-primary);
      transition: all 0.2s;
      outline: none;
    }

    .input::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.6;
    }

    .input:hover:not(:disabled) {
      border-color: var(--color-primary);
    }

    .input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .input:disabled {
      background: var(--color-background);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .input.has-error {
      border-color: var(--color-error);
    }

    .input.has-error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .helper-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .error-message {
      font-size: var(--font-size-sm);
      color: var(--color-error);
      display: none;
    }

    .error-message.visible {
      display: block;
    }

    .required-indicator {
      color: var(--color-error);
      margin-left: 2px;
    }
  </style>

  <div class="input-wrapper">
    <label class="label" part="label"></label>
    <div class="input-container">
      <input class="input" part="input" />
    </div>
    <span class="helper-text" part="helper-text"></span>
    <span class="error-message" part="error-message"></span>
  </div>
`;

class CustomInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clone template content once (efficient DOM cloning instead of parsing HTML)
    this.shadowRoot.appendChild(inputTemplate.content.cloneNode(true));
    
    // Cache DOM element references for performance
    this._label = this.shadowRoot.querySelector('.label');
    this._input = this.shadowRoot.querySelector('.input');
    this._helperText = this.shadowRoot.querySelector('.helper-text');
    this._errorMessage = this.shadowRoot.querySelector('.error-message');
  }

  static get observedAttributes() {
    return ['label', 'type', 'placeholder', 'value', 'required', 'disabled', 'error-message', 'helper-text'];
  }

  connectedCallback() {
    this.updateFromAttributes();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Only update if element is connected and value actually changed
    if (oldValue !== newValue && this._input) {
      this.updateAttribute(name, newValue);
    }
  }

  // Update individual attribute (no full re-render - just update specific DOM nodes!)
  updateAttribute(name, value) {
    switch (name) {
      case 'label':
        this.updateLabel();
        break;
      case 'type':
        this._input.type = value || 'text';
        break;
      case 'placeholder':
        this._input.placeholder = value || '';
        break;
      case 'value':
        if (this._input.value !== value) {
          this._input.value = value || '';
        }
        break;
      case 'required':
        this._input.required = this.hasAttribute('required');
        this.updateLabel();
        break;
      case 'disabled':
        this._input.disabled = this.hasAttribute('disabled');
        break;
      case 'error-message':
        this.updateErrorMessage();
        break;
      case 'helper-text':
        this._helperText.textContent = value || '';
        break;
    }
  }

  updateLabel() {
    const labelText = this.label || '';
    const requiredIndicator = this.required ? '<span class="required-indicator">*</span>' : '';
    this._label.innerHTML = labelText + requiredIndicator;
  }

  updateErrorMessage() {
    const errorMsg = this.errorMessage || '';
    this._errorMessage.textContent = errorMsg;
    if (errorMsg) {
      this._errorMessage.classList.add('visible');
      this._input.classList.add('has-error');
    } else {
      this._errorMessage.classList.remove('visible');
      this._input.classList.remove('has-error');
    }
  }

  // Initialize all attributes on first connect
  updateFromAttributes() {
    this._input.type = this.type;
    this._input.placeholder = this.placeholder;
    this._input.value = this.value;
    this._input.required = this.required;
    this._input.disabled = this.disabled;
    this.updateLabel();
    this._helperText.textContent = this.helperText;
    this.updateErrorMessage();
  }

  // Getters
  get label() {
    return this.getAttribute('label') || '';
  }

  get type() {
    return this.getAttribute('type') || 'text';
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  }

  get value() {
    return this._input ? this._input.value : this.getAttribute('value') || '';
  }

  set value(val) {
    if (this._input) {
      this._input.value = val;
    }
    this.setAttribute('value', val);
  }

  get required() {
    return this.hasAttribute('required');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  get helperText() {
    return this.getAttribute('helper-text') || '';
  }

  validate() {
    const isValid = this._input.validity.valid;
    
    this.dispatchEvent(new CustomEvent('validation-change', {
      bubbles: true,
      composed: true,
      detail: {
        isValid: isValid,
        value: this._input.value
      }
    }));
    
    return isValid;
  }

  attachEventListeners() {
    this._input.addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value);
      this.dispatchEvent(new CustomEvent('input-change', {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value
        }
      }));
    });

    this._input.addEventListener('focus', (e) => {
      this.dispatchEvent(new CustomEvent('input-focus', {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value
        }
      }));
    });

    this._input.addEventListener('blur', (e) => {
      this.validate();
      this.dispatchEvent(new CustomEvent('input-blur', {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value
        }
      }));
    });
  }
}

customElements.define('custom-input', CustomInput);

export default CustomInput;
