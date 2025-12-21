/**
 * CustomCard Web Component
 * 
 * A flexible card container with header, body, and footer sections.
 * Uses slots for maximum content flexibility.
 * 
 * @element custom-card
 * 
 * @slot header - Content for the card header
 * @slot default - Content for the card body (unnamed slot)
 * @slot footer - Content for the card footer
 * 
 * @attr {string} variant - Card style variant: 'default', 'outlined', 'elevated'
 * @attr {string} padding - Padding size: 'none', 'sm', 'md', 'lg'
 * @attr {boolean} hoverable - Whether the card has hover effects
 * @attr {boolean} clickable - Whether the card is clickable with pointer cursor
 * 
 * @fires card-click - Dispatched when clickable card is clicked
 * 
 * @example
 * <custom-card variant="elevated" padding="lg">
 *   <h3 slot="header">Card Title</h3>
 *   <p>Card content goes here</p>
 *   <div slot="footer">
 *     <button>Action</button>
 *   </div>
 * </custom-card>
 */

// Create HTML template once
const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
    }

    .card {
      background: var(--color-surface);
      border-radius: var(--border-radius-md);
      color: var(--color-on-surface);
      transition: var(--transition-base);
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    /* Variants */
    .card.variant-default {
      border: 1px solid var(--color-border);
    }

    .card.variant-outlined {
      border: 2px solid var(--color-border);
      background: transparent;
    }

    .card.variant-elevated {
      border: none;
      box-shadow: var(--shadow-md);
    }

    /* Hoverable state */
    .card.hoverable:hover {
      transform: translateY(-2px);
    }

    .card.variant-default.hoverable:hover {
      border-color: var(--color-primary);
    }

    .card.variant-outlined.hoverable:hover {
      border-color: var(--color-primary);
    }

    .card.variant-elevated.hoverable:hover {
      box-shadow: var(--shadow-lg);
    }

    /* Clickable state */
    .card.clickable {
      cursor: pointer;
    }

    .card.clickable:active {
      transform: scale(0.98);
    }

    /* Header */
    .card-header {
      border-bottom: 1px solid var(--color-border);
      font-weight: var(--font-weight-semibold);
    }

    .card-header:empty {
      display: none;
    }

    .card-header ::slotted(*) {
      margin: 0;
    }

    /* Body */
    .card-body {
      flex: 1;
    }

    /* Footer */
    .card-footer {
      border-top: 1px solid var(--color-border);
    }

    .card-footer:empty {
      display: none;
    }

    /* Padding variants */
    .padding-none .card-header,
    .padding-none .card-body,
    .padding-none .card-footer {
      padding: 0;
    }

    .padding-sm .card-header,
    .padding-sm .card-body,
    .padding-sm .card-footer {
      padding: var(--spacing-sm);
    }

    .padding-md .card-header,
    .padding-md .card-body,
    .padding-md .card-footer {
      padding: var(--spacing-md);
    }

    .padding-lg .card-header,
    .padding-lg .card-body,
    .padding-lg .card-footer {
      padding: var(--spacing-lg);
    }

    /* Remove padding for header/footer when empty */
    .card-header:empty,
    .card-footer:empty {
      padding: 0;
      border: none;
    }

    /* Slot styling hints */
    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      margin-bottom: var(--spacing-xs);
    }

    ::slotted(p) {
      line-height: var(--line-height-relaxed);
    }

    ::slotted(img) {
      max-width: 100%;
      height: auto;
      display: block;
    }
  </style>

  <div class="card">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
`;

class CustomCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clone template
    this.shadowRoot.appendChild(cardTemplate.content.cloneNode(true));
    
    // Cache DOM references
    this._card = this.shadowRoot.querySelector('.card');
  }

  static get observedAttributes() {
    return ['variant', 'padding', 'hoverable', 'clickable'];
  }

  connectedCallback() {
    this.updateFromAttributes();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._card) {
      this.updateClasses();
    }
  }

  updateClasses() {
    this._card.className = `card variant-${this.variant} padding-${this.padding} ${this.hoverable ? 'hoverable' : ''} ${this.clickable ? 'clickable' : ''}`;
  }

  updateFromAttributes() {
    this.updateClasses();
  }

  get variant() {
    return this.getAttribute('variant') || 'default';
  }

  set variant(value) {
    this.setAttribute('variant', value);
  }

  get padding() {
    return this.getAttribute('padding') || 'md';
  }

  set padding(value) {
    this.setAttribute('padding', value);
  }

  get hoverable() {
    return this.hasAttribute('hoverable');
  }

  set hoverable(value) {
    if (value) {
      this.setAttribute('hoverable', '');
    } else {
      this.removeAttribute('hoverable');
    }
  }

  get clickable() {
    return this.hasAttribute('clickable');
  }

  set clickable(value) {
    if (value) {
      this.setAttribute('clickable', '');
    } else {
      this.removeAttribute('clickable');
    }
  }

  attachEventListeners() {
    if (this.clickable) {
      this._card.addEventListener('click', (event) => {
        this.dispatchEvent(new CustomEvent('card-click', {
          bubbles: true,
          composed: true,
          detail: {
            event: event
          }
        }));
      });
    }
  }
}

customElements.define('custom-card', CustomCard);

export default CustomCard;
