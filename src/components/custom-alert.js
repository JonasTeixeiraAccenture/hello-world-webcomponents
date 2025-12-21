/**
 * CustomAlert Web Component
 * 
 * A flexible alert/message component for displaying notifications,
 * errors, warnings, and informational messages.
 * 
 * @element custom-alert
 * 
 * @slot default - Main alert content
 * @slot title - Optional alert title
 * @slot actions - Optional action buttons
 * 
 * @attr {string} variant - Alert style: 'success', 'error', 'warning', 'info'
 * @attr {string} size - Alert size: 'sm', 'md', 'lg'
 * @attr {boolean} dismissible - Whether the alert can be dismissed
 * @attr {boolean} show-icon - Whether to show the variant icon
 * @attr {number} auto-dismiss - Auto-dismiss after N milliseconds
 * @attr {boolean} outlined - Use outlined style instead of filled
 * 
 * @fires alert-dismissed - Dispatched when alert is dismissed
 * @fires alert-mounted - Dispatched when alert is connected to DOM
 * 
 * @method dismiss() - Programmatically dismiss the alert
 * @method show() - Show the alert (reverses dismiss)
 * 
 * @example
 * <custom-alert variant="success" dismissible>
 *   <span slot="title">Success!</span>
 *   Your changes have been saved successfully.
 * </custom-alert>
 */

// Create HTML template once
const alertTemplate = document.createElement('template');
alertTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
    }

    @keyframes alertShow {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes alertDismiss {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      border-radius: var(--border-radius-md);
      transition: var(--transition-base);
      animation: alertShow 0.3s ease-out;
      position: relative;
    }

    /* Size variants */
    .alert.size-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.875rem;
    }

    .alert.size-md {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 1rem;
    }

    .alert.size-lg {
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: 1.125rem;
    }

    /* Filled variants */
    .alert.variant-success {
      background: var(--color-success-light);
      border: 1px solid var(--color-success);
      color: var(--color-success-dark);
    }

    .alert.variant-error {
      background: var(--color-error-light);
      border: 1px solid var(--color-error);
      color: var(--color-error-dark);
    }

    .alert.variant-warning {
      background: var(--color-warning-light);
      border: 1px solid var(--color-warning);
      color: var(--color-warning-dark);
    }

    .alert.variant-info {
      background: var(--color-info-light);
      border: 1px solid var(--color-info);
      color: var(--color-info-dark);
    }

    /* Outlined variants */
    .alert.outlined.variant-success {
      background: transparent;
      border: 2px solid var(--color-success);
      color: var(--color-success-dark);
    }

    .alert.outlined.variant-error {
      background: transparent;
      border: 2px solid var(--color-error);
      color: var(--color-error-dark);
    }

    .alert.outlined.variant-warning {
      background: transparent;
      border: 2px solid var(--color-warning);
      color: var(--color-warning-dark);
    }

    .alert.outlined.variant-info {
      background: transparent;
      border: 2px solid var(--color-info);
      color: var(--color-info-dark);
    }

    /* Icon */
    .alert-icon {
      flex-shrink: 0;
      font-size: 1.5em;
      line-height: 1;
      font-weight: bold;
    }

    .alert.size-sm .alert-icon {
      font-size: 1.25em;
    }

    .alert.size-lg .alert-icon {
      font-size: 1.75em;
    }

    .alert.variant-success .alert-icon {
      color: var(--color-success);
    }

    .alert.variant-error .alert-icon {
      color: var(--color-error);
    }

    .alert.variant-warning .alert-icon {
      color: var(--color-warning);
    }

    .alert.variant-info .alert-icon {
      color: var(--color-info);
    }

    /* Content */
    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .alert-title:empty {
      display: none;
    }

    .alert-message {
      line-height: var(--line-height-relaxed);
    }

    .alert-actions {
      margin-top: var(--spacing-sm);
    }

    .alert-actions:empty {
      display: none;
    }

    /* Dismiss button */
    .dismiss-button {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 1.25em;
      line-height: 1;
      opacity: 0.6;
      transition: opacity 0.2s;
      color: currentColor;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-sm);
    }

    .dismiss-button:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }

    .dismiss-button:active {
      transform: scale(0.95);
    }

    .alert.size-sm .dismiss-button {
      font-size: 1em;
      width: 20px;
      height: 20px;
    }

    .alert.size-lg .dismiss-button {
      font-size: 1.5em;
      width: 28px;
      height: 28px;
    }
  </style>

  <div class="alert">
    <div class="alert-icon"></div>
    <div class="alert-content">
      <div class="alert-title">
        <slot name="title"></slot>
      </div>
      <div class="alert-message">
        <slot></slot>
      </div>
      <div class="alert-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <button class="dismiss-button" aria-label="Dismiss alert" style="display: none;">✕</button>
  </div>
`;

class CustomAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clone template
    this.shadowRoot.appendChild(alertTemplate.content.cloneNode(true));
    
    // Cache DOM references
    this._alert = this.shadowRoot.querySelector('.alert');
    this._icon = this.shadowRoot.querySelector('.alert-icon');
    this._dismissButton = this.shadowRoot.querySelector('.dismiss-button');
    
    this._autoDismissTimer = null;
  }

  static get observedAttributes() {
    return ['variant', 'size', 'dismissible', 'show-icon', 'auto-dismiss', 'outlined'];
  }

  connectedCallback() {
    this.updateFromAttributes();
    this.setupAutoDismiss();
    this.attachEventListeners();
    
    this.dispatchEvent(new CustomEvent('alert-mounted', {
      bubbles: true,
      composed: true
    }));
  }

  disconnectedCallback() {
    this.clearAutoDismiss();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._alert) {
      if (name === 'auto-dismiss') {
        this.setupAutoDismiss();
      } else {
        this.updateAttribute(name, newValue);
      }
    }
  }

  updateAttribute(name, value) {
    switch (name) {
      case 'variant':
      case 'size':
      case 'outlined':
        this.updateClasses();
        this.updateIcon();
        break;
      case 'dismissible':
        this.updateDismissButton();
        break;
      case 'show-icon':
        this.updateIcon();
        break;
    }
  }

  updateClasses() {
    this._alert.className = `alert variant-${this.variant} size-${this.size} ${this.outlined ? 'outlined' : ''}`;
  }

  updateIcon() {
    if (this.showIcon) {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      this._icon.textContent = icons[this.variant] || icons.info;
      this._icon.style.display = '';
    } else {
      this._icon.style.display = 'none';
    }
  }

  updateDismissButton() {
    this._dismissButton.style.display = this.dismissible ? 'flex' : 'none';
  }

  updateFromAttributes() {
    this.updateClasses();
    this.updateIcon();
    this.updateDismissButton();
  }

  get variant() {
    return this.getAttribute('variant') || 'info';
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

  get dismissible() {
    return this.hasAttribute('dismissible');
  }

  set dismissible(value) {
    if (value) {
      this.setAttribute('dismissible', '');
    } else {
      this.removeAttribute('dismissible');
    }
  }

  get showIcon() {
    return this.hasAttribute('show-icon') ? this.getAttribute('show-icon') !== 'false' : true;
  }

  set showIcon(value) {
    if (value) {
      this.setAttribute('show-icon', 'true');
    } else {
      this.setAttribute('show-icon', 'false');
    }
  }

  get autoDismiss() {
    const value = parseInt(this.getAttribute('auto-dismiss') || '0', 10);
    return isNaN(value) ? 0 : value;
  }

  set autoDismiss(value) {
    this.setAttribute('auto-dismiss', value.toString());
  }

  get outlined() {
    return this.hasAttribute('outlined');
  }

  set outlined(value) {
    if (value) {
      this.setAttribute('outlined', '');
    } else {
      this.removeAttribute('outlined');
    }
  }

  setupAutoDismiss() {
    this.clearAutoDismiss();
    
    if (this.autoDismiss > 0) {
      this._autoDismissTimer = setTimeout(() => {
        this.dismiss();
      }, this.autoDismiss);
    }
  }

  clearAutoDismiss() {
    if (this._autoDismissTimer) {
      clearTimeout(this._autoDismissTimer);
      this._autoDismissTimer = null;
    }
  }

  dismiss() {
    this._alert.style.animation = 'alertDismiss 0.3s ease-out forwards';
    
    setTimeout(() => {
      this.style.display = 'none';
      
      this.dispatchEvent(new CustomEvent('alert-dismissed', {
        bubbles: true,
        composed: true,
        detail: {
          variant: this.variant
        }
      }));
    }, 300);
  }

  show() {
    this.style.display = 'block';
    this._alert.style.animation = 'alertShow 0.3s ease-out forwards';
    this.setupAutoDismiss();
  }

  attachEventListeners() {
    this._dismissButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.dismiss();
    });
  }
}

customElements.define('custom-alert', CustomAlert);

export default CustomAlert;
