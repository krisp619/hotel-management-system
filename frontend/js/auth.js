// Frontend Authentication Logic
const API_URL = 'http://localhost:5000';

// Toggle password visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  field.type = field.type === 'password' ? 'text' : 'password';
}

// Switch between login and register forms
function switchForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (formType === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
  } else {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
  }
  
  // Clear messages
  clearMessages();
}

// Clear all messages
function clearMessages() {
  document.querySelectorAll('.error-message, .success-message').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

// Show error message
function showError(message, formType) {
  const errorEl = document.getElementById(`${formType}Error`);
  errorEl.textContent = message;
  errorEl.classList.add('show');
}

// Show success message
function showSuccess(message, formType) {
  const successEl = document.getElementById(`${formType}Success`);
  successEl.textContent = message;
  successEl.classList.add('show');
}

// Show loading state
function showLoading(formType, show = true) {
  const loadingEl = document.getElementById(`${formType}Loading`);
  if (show) {
    loadingEl.classList.add('show');
  } else {
    loadingEl.classList.remove('show');
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  clearMessages();
  showLoading('login', true);
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    showSuccess('Login successful! Redirecting...', 'login');
    
    // Redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    showError(error.message || 'Login failed. Please try again.', 'login');
  } finally {
    showLoading('login', false);
  }
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirm').value;
  
  // Validation
  if (password.length < 6) {
    showError('Password must be at least 6 characters', 'register');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('Passwords do not match', 'register');
    return;
  }
  
  clearMessages();
  showLoading('register', true);
  
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Save token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    showSuccess('Registration successful! Redirecting...', 'register');
    
    // Redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    showError(error.message || 'Registration failed. Please try again.', 'register');
  } finally {
    showLoading('register', false);
  }
}

// Get authentication token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Logout
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = 'auth.html';
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'auth.html';
  }
}
