

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const statusBanner = document.getElementById('form-status');

  if (!form) return;

  // Form controls
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectSelect = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const consentCheckbox = document.getElementById('contact-consent');
  const radioButtons = form.querySelectorAll('input[name="referral_source"]');
  const fieldset = document.getElementById('group-source');

  // Error display elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const sourceError = document.getElementById('source-error');
  const messageError = document.getElementById('message-error');
  const consentError = document.getElementById('consent-error');

  /**
   * Standard email regex pattern conforming to HTML5 spec requirements.
   */
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  /**
   * Display an error message and set accessibility attributes for a field.
   * @param {HTMLElement} inputEl
   * @param {HTMLElement} errorEl
   * @param {string} message
   */
  function showError(inputEl, errorEl, message) {
    if (errorEl) {
      errorEl.textContent = message;
    }
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Clear error message and reset accessibility attributes for a field.
   * @param {HTMLElement} inputEl
   * @param {HTMLElement} errorEl
   */
  function clearError(inputEl, errorEl) {
    if (errorEl) {
      errorEl.textContent = '';
    }
    if (inputEl) {
      inputEl.removeAttribute('aria-invalid');
    }
  }

  /**
   * Validate all form fields.
   * @returns {{ isValid: boolean, firstInvalid: HTMLElement|null }}
   */
  function validateForm() {
    let isValid = true;
    let firstInvalid = null;

    // 1. Name validation (trimmed length >= 3)
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (nameVal.length < 3) {
      showError(
        nameInput,
        nameError,
        nameVal.length === 0
          ? 'Please enter your full name.'
          : 'Name must be at least 3 characters long.'
      );
      isValid = false;
      if (!firstInvalid) firstInvalid = nameInput;
    } else {
      clearError(nameInput, nameError);
    }

    // 2. Email validation (non-empty and valid pattern)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (emailVal.length === 0) {
      showError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
    } else if (!EMAIL_REGEX.test(emailVal)) {
      showError(emailInput, emailError, 'Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
    } else {
      clearError(emailInput, emailError);
    }

    // 3. Subject validation (valid option selected)
    const subjectVal = subjectSelect ? subjectSelect.value : '';
    if (!subjectVal) {
      showError(subjectSelect, subjectError, 'Please select a reason for your inquiry.');
      isValid = false;
      if (!firstInvalid) firstInvalid = subjectSelect;
    } else {
      clearError(subjectSelect, subjectError);
    }

    // 4. Referral source validation (at least one radio selected)
    const checkedRadio = form.querySelector('input[name="referral_source"]:checked');
    if (!checkedRadio) {
      showError(fieldset, sourceError, 'Please let us know how you heard about me.');
      isValid = false;
      if (!firstInvalid && radioButtons.length > 0) firstInvalid = radioButtons[0];
    } else {
      clearError(fieldset, sourceError);
    }

    // 5. Message validation (trimmed length >= 20)
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (messageVal.length < 20) {
      showError(
        messageInput,
        messageError,
        messageVal.length === 0
          ? 'Please enter your message.'
          : `Message must be at least 20 characters long (currently ${messageVal.length} characters).`
      );
      isValid = false;
      if (!firstInvalid) firstInvalid = messageInput;
    } else {
      clearError(messageInput, messageError);
    }

    // 6. Consent checkbox validation
    if (consentCheckbox && !consentCheckbox.checked) {
      showError(consentCheckbox, consentError, 'You must agree to the data processing consent to proceed.');
      isValid = false;
      if (!firstInvalid) firstInvalid = consentCheckbox;
    } else {
      clearError(consentCheckbox, consentError);
    }

    return { isValid, firstInvalid };
  }

  /**
   * Set up live inline validation clearance as the user types or changes inputs.
   */
  function setupLiveValidation() {
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 3) {
          clearError(nameInput, nameError);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (EMAIL_REGEX.test(emailInput.value.trim())) {
          clearError(emailInput, emailError);
        }
      });
    }

    if (subjectSelect) {
      subjectSelect.addEventListener('change', () => {
        if (subjectSelect.value) {
          clearError(subjectSelect, subjectError);
        }
      });
    }

    radioButtons.forEach((radio) => {
      radio.addEventListener('change', () => {
        clearError(fieldset, sourceError);
      });
    });

    if (messageInput) {
      messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length >= 20) {
          clearError(messageInput, messageError);
        }
      });
    }

    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked) {
          clearError(consentCheckbox, consentError);
        }
      });
    }
  }

  /**
   * Handle form submission event.
   * @param {Event} event
   */
  function handleSubmit(event) {
    event.preventDefault();

    const { isValid, firstInvalid } = validateForm();

    if (!isValid) {
      if (statusBanner) {
        statusBanner.className = 'form-status form-status-error';
        statusBanner.textContent = 'Please correct the highlighted errors below before submitting.';
        statusBanner.removeAttribute('hidden');
      }

      // Shift focus to the first invalid control
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Success State
    if (statusBanner) {
      statusBanner.className = 'form-status form-status-success';
      statusBanner.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
      statusBanner.removeAttribute('hidden');
      statusBanner.focus();
    }

    // Reset form fields
    form.reset();

    // Clear all error states
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(subjectSelect, subjectError);
    clearError(fieldset, sourceError);
    clearError(messageInput, messageError);
    clearError(consentCheckbox, consentError);
  }

  form.addEventListener('submit', handleSubmit);
  setupLiveValidation();
})();
