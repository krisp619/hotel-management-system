// ============================================
// Hotel Management System - Booking Page JS
// ============================================

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Check authentication on page load
window.addEventListener('load', () => {
  if (!isLoggedIn()) {
    window.location.href = 'auth.html';
  }
  updateUserInfo();
});

// Update user info in header
function updateUserInfo() {
  const user = getCurrentUser();
  const userNameEl = document.getElementById('userName');
  const userEmailEl = document.getElementById('userEmail');
  
  if (user && userNameEl && userEmailEl) {
    userNameEl.textContent = user.name;
    userEmailEl.textContent = user.email;
  }
}

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const successText = document.getElementById('successText');
const errorText = document.getElementById('errorText');
const submitBtn = document.getElementById('submitBtn');

// Form input fields
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roomTypeInput = document.getElementById('roomType');
const checkInInput = document.getElementById('checkInDate');
const checkOutInput = document.getElementById('checkOutDate');

// Error message elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const roomTypeError = document.getElementById('roomTypeError');
const checkInError = document.getElementById('checkInError');
const checkOutError = document.getElementById('checkOutError');

/**
 * Set minimum date for check-in to today
 * This prevents users from booking in the past
 */
function setMinDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const minDate = `${year}-${month}-${date}`;
  
  checkInInput.setAttribute('min', minDate);
  checkOutInput.setAttribute('min', minDate);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate form data before submission
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
  let isValid = true;

  // Clear previous error messages
  nameError.textContent = '';
  nameError.classList.remove('show');
  emailError.textContent = '';
  emailError.classList.remove('show');
  roomTypeError.textContent = '';
  roomTypeError.classList.remove('show');
  checkInError.textContent = '';
  checkInError.classList.remove('show');
  checkOutError.textContent = '';
  checkOutError.classList.remove('show');

  // Validate name
  if (!nameInput.value.trim()) {
    nameError.textContent = 'Guest name is required';
    nameError.classList.add('show');
    isValid = false;
  } else if (nameInput.value.trim().length < 2) {
    nameError.textContent = 'Guest name must be at least 2 characters';
    nameError.classList.add('show');
    isValid = false;
  }

  // Validate email
  if (!emailInput.value.trim()) {
    emailError.textContent = 'Email address is required';
    emailError.classList.add('show');
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    emailError.textContent = 'Please enter a valid email address';
    emailError.classList.add('show');
    isValid = false;
  }

  // Validate room type
  if (!roomTypeInput.value) {
    roomTypeError.textContent = 'Please select a room type';
    roomTypeError.classList.add('show');
    isValid = false;
  }

  // Validate check-in date
  if (!checkInInput.value) {
    checkInError.textContent = 'Check-in date is required';
    checkInError.classList.add('show');
    isValid = false;
  }

  // Validate check-out date
  if (!checkOutInput.value) {
    checkOutError.textContent = 'Check-out date is required';
    checkOutError.classList.add('show');
    isValid = false;
  }

  // Validate check-out is after check-in
  if (checkInInput.value && checkOutInput.value) {
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    if (checkOutDate <= checkInDate) {
      checkOutError.textContent = 'Check-out date must be after check-in date';
      checkOutError.classList.add('show');
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Show success message to user
 * @param {string} message - Success message text
 */
function showSuccessMessage(message) {
  successText.textContent = message;
  successMessage.style.display = 'flex';
  errorMessage.style.display = 'none';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

/**
 * Show error message to user
 * @param {string} message - Error message text
 */
function showErrorMessage(message) {
  errorText.textContent = message;
  errorMessage.style.display = 'flex';
  successMessage.style.display = 'none';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

/**
 * Close alert messages
 */
function closeMessage() {
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}

/**
 * Reset form to initial state
 */
function resetForm() {
  bookingForm.reset();
  // Clear error messages
  nameError.textContent = '';
  nameError.classList.remove('show');
  emailError.textContent = '';
  emailError.classList.remove('show');
  roomTypeError.textContent = '';
  roomTypeError.classList.remove('show');
  checkInError.textContent = '';
  checkInError.classList.remove('show');
  checkOutError.textContent = '';
  checkOutError.classList.remove('show');
}

/**
 * Submit booking to backend API
 * @param {Object} bookingData - Booking data to submit
 */
async function submitBooking(bookingData) {
  try {
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    submitBtn.disabled = true;

    // Make POST request to backend
    const response = await fetch(`${API_BASE_URL}/book-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(bookingData),
    });

    // Parse response
    const result = await response.json();

    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;

    // Check if request was successful
    if (response.ok && result.success) {
      showSuccessMessage(
        `🎉 ${result.message} Booking ID: ${result.data._id.substring(0, 8)}`
      );
      resetForm();
      console.log('Booking created successfully:', result.data);
    } else {
      showErrorMessage(result.message || 'Failed to create booking');
      console.error('Booking error:', result);
    }
  } catch (error) {
    // Handle network or parsing errors
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;
    showErrorMessage(
      'Error connecting to server. Please check if backend is running.'
    );
    console.error('Fetch error:', error);
  }
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Prepare booking data
  const bookingData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    roomType: roomTypeInput.value,
    checkInDate: checkInInput.value,
    checkOutDate: checkOutInput.value,
  };

  // Submit booking
  submitBooking(bookingData);
}

/**
 * Update check-out minimum date when check-in changes
 * This ensures check-out is always after check-in
 */
checkInInput.addEventListener('change', function () {
  if (this.value) {
    // Set check-out minimum to be at least 1 day after check-in
    const checkInDate = new Date(this.value);
    checkInDate.setDate(checkInDate.getDate() + 1);
    
    const year = checkInDate.getFullYear();
    const month = String(checkInDate.getMonth() + 1).padStart(2, '0');
    const date = String(checkInDate.getDate()).padStart(2, '0');
    const minCheckOutDate = `${year}-${month}-${date}`;
    
    checkOutInput.setAttribute('min', minCheckOutDate);
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  setMinDate();
  bookingForm.addEventListener('submit', handleFormSubmit);
  console.log('✓ Hotel Booking System loaded');
  console.log('✓ API URL:', API_BASE_URL);
});
