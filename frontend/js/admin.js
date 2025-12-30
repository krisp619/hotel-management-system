// ============================================
// Hotel Management System - Admin Dashboard JS
// ============================================

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Pagination settings
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const bookingsTableBody = document.getElementById('bookingsTableBody');
const bookingsContainer = document.getElementById('bookingsContainer');
const noBookings = document.getElementById('noBookings');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Filter elements
const filterEmail = document.getElementById('filterEmail');
const filterRoomType = document.getElementById('filterRoomType');
const refreshBtn = document.getElementById('refreshBtn');

// Pagination elements
const paginationContainer = document.getElementById('paginationContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// Statistics elements
const totalBookingsEl = document.getElementById('totalBookings');
const singleRoomsEl = document.getElementById('singleRooms');
const doubleRoomsEl = document.getElementById('doubleRooms');
const deluxeRoomsEl = document.getElementById('deluxeRooms');

// Modal elements
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let deleteBookingId = null;

/**
 * Show loading spinner
 */
function showLoading() {
  loadingSpinner.style.display = 'block';
  bookingsContainer.style.display = 'none';
  noBookings.style.display = 'none';
  errorMessage.style.display = 'none';
}

/**
 * Hide loading spinner
 */
function hideLoading() {
  loadingSpinner.style.display = 'none';
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = 'block';
  bookingsContainer.style.display = 'none';
  noBookings.style.display = 'none';
  hideLoading();
}

/**
 * Hide error message
 */
function hideError() {
  errorMessage.style.display = 'none';
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Calculate statistics from bookings
 * @param {Array} bookings - Array of booking objects
 */
function calculateStatistics(bookings) {
  let singleCount = 0;
  let doubleCount = 0;
  let deluxeCount = 0;

  bookings.forEach((booking) => {
    switch (booking.roomType) {
      case 'Single':
        singleCount++;
        break;
      case 'Double':
        doubleCount++;
        break;
      case 'Deluxe':
        deluxeCount++;
        break;
    }
  });

  totalBookingsEl.textContent = bookings.length;
  singleRoomsEl.textContent = singleCount;
  doubleRoomsEl.textContent = doubleCount;
  deluxeRoomsEl.textContent = deluxeCount;
}

/**
 * Create action buttons for each booking
 * @param {string} bookingId - Booking ID
 * @returns {HTMLElement} - Action buttons container
 */
function createActionButtons(bookingId) {
  const container = document.createElement('div');
  container.className = 'action-buttons';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'btn-edit';
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => editBooking(bookingId);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => openDeleteModal(bookingId);

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}

/**
 * Render bookings table with data
 * @param {Array} bookings - Array of booking objects
 */
function renderBookings(bookings) {
  bookingsTableBody.innerHTML = ''; // Clear existing rows

  if (bookings.length === 0) {
    bookingsContainer.style.display = 'none';
    noBookings.style.display = 'block';
    paginationContainer.style.display = 'none';
    calculateStatistics([]);
    return;
  }

  bookingsContainer.style.display = 'block';
  noBookings.style.display = 'none';

  // Create table rows for each booking
  bookings.forEach((booking) => {
    const row = document.createElement('tr');

    // Extract name, limiting to reasonable length
    const name = booking.name || 'N/A';

    // Extract email
    const email = booking.email || 'N/A';

    // Extract room type
    const roomType = booking.roomType || 'N/A';

    // Format dates
    const checkInDate = formatDate(booking.checkInDate);
    const checkOutDate = formatDate(booking.checkOutDate);
    const createdAt = formatDate(booking.createdAt);

    row.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td><span style="background-color: #e3f2fd; padding: 0.25rem 0.75rem; border-radius: 4px;">${roomType}</span></td>
      <td>${checkInDate}</td>
      <td>${checkOutDate}</td>
      <td>${createdAt}</td>
      <td></td>
    `;

    // Add action buttons to last cell
    row.cells[6].appendChild(createActionButtons(booking._id));

    bookingsTableBody.appendChild(row);
  });

  // Calculate and update statistics
  calculateStatistics(bookings);
}

/**
 * Fetch bookings from API with filters
 * @param {number} page - Page number for pagination
 */
async function fetchBookings(page = 1) {
  try {
    showLoading();
    hideError();

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', itemsPerPage);

    if (filterEmail.value) {
      params.append('email', filterEmail.value);
    }

    if (filterRoomType.value) {
      params.append('roomType', filterRoomType.value);
    }

    // Make API request
    const response = await fetch(`${API_BASE_URL}/bookings?${params}`);
    const result = await response.json();

    hideLoading();

    if (!response.ok || !result.success) {
      showError(result.message || 'Failed to fetch bookings');
      return;
    }

    // Render bookings
    renderBookings(result.data);

    // Update pagination
    currentPage = parseInt(page);
    pageInfo.textContent = `Page ${currentPage} of ${result.totalPages}`;

    // Show/hide pagination buttons
    paginationContainer.style.display = 'flex';
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === result.totalPages;

    console.log('✓ Bookings loaded:', result.data.length);
  } catch (error) {
    hideLoading();
    showError('Error connecting to server. Please check if backend is running.');
    console.error('Fetch error:', error);
  }
}

/**
 * Open delete confirmation modal
 * @param {string} bookingId - Booking ID to delete
 */
function openDeleteModal(bookingId) {
  deleteBookingId = bookingId;
  deleteModal.style.display = 'flex';
}

/**
 * Close delete confirmation modal
 */
function closeModal() {
  deleteModal.style.display = 'none';
  deleteBookingId = null;
}

/**
 * Delete a booking
 * @param {string} bookingId - Booking ID to delete
 */
async function deleteBooking(bookingId) {
  try {
    showLoading();
    hideError();

    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    closeModal();
    hideLoading();

    if (!response.ok || !result.success) {
      showError(result.message || 'Failed to delete booking');
      return;
    }

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success';
    successMsg.textContent = '✓ Booking deleted successfully!';
    document.querySelector('.admin-section').prepend(successMsg);

    setTimeout(() => successMsg.remove(), 3000);

    // Reload bookings
    fetchBookings(currentPage);

    console.log('✓ Booking deleted successfully');
  } catch (error) {
    hideLoading();
    showError('Error deleting booking');
    console.error('Delete error:', error);
  }
}

/**
 * Edit a booking (placeholder for future implementation)
 * @param {string} bookingId - Booking ID to edit
 */
function editBooking(bookingId) {
  alert(`Edit functionality for booking ${bookingId} will be implemented soon.`);
  // In a full implementation, this would open an edit modal or form
}

/**
 * Handle pagination
 */
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    fetchBookings(currentPage - 1);
  }
});

nextBtn.addEventListener('click', () => {
  fetchBookings(currentPage + 1);
});

/**
 * Handle filter changes
 */
filterEmail.addEventListener('input', () => {
  currentPage = 1; // Reset to first page
  fetchBookings(currentPage);
});

filterRoomType.addEventListener('change', () => {
  currentPage = 1; // Reset to first page
  fetchBookings(currentPage);
});

/**
 * Handle refresh button
 */
refreshBtn.addEventListener('click', () => {
  currentPage = 1;
  filterEmail.value = '';
  filterRoomType.value = '';
  fetchBookings(currentPage);
});

/**
 * Handle delete confirmation
 */
confirmDeleteBtn.addEventListener('click', () => {
  if (deleteBookingId) {
    deleteBooking(deleteBookingId);
  }
});

/**
 * Close modal when clicking outside
 */
deleteModal.addEventListener('click', (event) => {
  if (event.target === deleteModal) {
    closeModal();
  }
});

/**
 * Initialize admin dashboard
 */
document.addEventListener('DOMContentLoaded', () => {
  fetchBookings(1);
  console.log('✓ Admin Dashboard loaded');
  console.log('✓ API URL:', API_BASE_URL);
});
