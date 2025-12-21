/**
 * Hello World Application
 * Main application logic
 */

import './components/main.js';

// State
const state = { attempts: 0, successes: 0, errors: 0 };

// DOM Elements
const form = document.getElementById('main-form');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const resultDisplay = document.getElementById('result-display');
const toastContainer = document.getElementById('toast-container');
const attemptsCount = document.getElementById('attempts-count');
const successCount = document.getElementById('success-count');
const errorCount = document.getElementById('error-count');

// Show toast notification
function showToast(variant, title, message, duration = 4000) {
  const alert = document.createElement('custom-alert');
  alert.variant = variant;
  alert.dismissible = true;
  alert.autoDismiss = duration;
  
  const titleSlot = document.createElement('span');
  titleSlot.slot = 'title';
  titleSlot.textContent = title;
  
  alert.appendChild(titleSlot);
  alert.appendChild(document.createTextNode(message));
  toastContainer.appendChild(alert);
  
  alert.addEventListener('alert-dismissed', () => {
    setTimeout(() => alert.remove(), 300);
  });
}

// Update stats
function updateStats() {
  attemptsCount.textContent = state.attempts;
  successCount.textContent = state.successes;
  errorCount.textContent = state.errors;
}

// Display result
function displayResult(type, title, message, icon) {
  resultDisplay.innerHTML = `
    <div class="result-content ${type}-result">
      <div class="result-icon">${icon}</div>
      <h3 class="result-title">${title}</h3>
      <p class="result-message">${message}</p>
    </div>
  `;
}

// Show loading
function showLoading() {
  displayResult('loading', 'Processing...', 'Validating your input', '⏳');
}

// Validate input (mock with 800ms delay)
async function validateInput(input) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      valid: false,
      message: 'Input cannot be empty. Please provide "world" as input.'
    };
  }

  if (trimmed.toLowerCase() === 'world') {
    return { valid: true, message: 'Hello World' };
  } else {
    return {
      valid: false,
      message: `Expected "world", but received "${trimmed}".`
    };
  }
}

// Handle form submit
async function handleSubmit(event) {
  event.preventDefault();
  
  const inputValue = userInput.value;
  
  state.attempts++;
  updateStats();

  submitBtn.setLoading(true);
  showLoading();
  
  userInput.removeAttribute('error-message');

  try {
    const result = await validateInput(inputValue);

    if (result.valid) {
      state.successes++;
      updateStats();
      
      displayResult('success', '🎉 Success!', result.message, '✅');
      showToast('success', 'Success', result.message);

      setTimeout(() => userInput.value = '', 2000);
    } else {
      state.errors++;
      updateStats();
      
      displayResult('error', 'Invalid Input', result.message, '❌');
      showToast('error', 'Failed', result.message, 5000);

      userInput.setAttribute('error-message', 'Invalid input');
      setTimeout(() => userInput.shadowRoot.querySelector('input').focus(), 100);
    }
  } catch (error) {
    state.errors++;
    updateStats();
    
    displayResult('error', 'Error', 'An unexpected error occurred.', '⚠️');
    showToast('error', 'Error', 'Please try again');
  } finally {
    submitBtn.setLoading(false);
  }
}

// Handle clear
function handleClear() {
  userInput.value = '';
  userInput.removeAttribute('error-message');
  
  resultDisplay.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">💬</div>
      <p>Your result will appear here</p>
    </div>
  `;
  
  showToast('info', 'Cleared', 'Ready for new input', 2000);
  setTimeout(() => userInput.shadowRoot.querySelector('input').focus(), 100);
}

// Event listeners
form.addEventListener('submit', handleSubmit);
submitBtn.addEventListener('button-click', handleSubmit);
clearBtn.addEventListener('button-click', handleClear);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit(e);
});

// Initialize
window.addEventListener('load', () => {
  setTimeout(() => {
    userInput.shadowRoot.querySelector('input').focus();
    showToast('info', 'Welcome! 👋', 'Enter "world" to see the magic', 5000);
  }, 500);
});
