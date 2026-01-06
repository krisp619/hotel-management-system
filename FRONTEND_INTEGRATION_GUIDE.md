# 🎨 Frontend Developer Guide - API Integration

**Date:** January 6, 2026  
**Backend Status:** ✅ Fixed & Ready  
**Frontend Integration:** Ready to use

---

## 🚀 Quick Start

### Backend API Endpoint
```
Production: http://23.22.102.15:5000
Development: http://localhost:5000
Health Check: GET /api/health
```

### Update .env (frontend-react)
```env
# .env.production
VITE_API_BASE_URL=http://23.22.102.15:5000

# .env (development)
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📝 API Endpoints Reference

### 1️⃣ Register User

```javascript
// Request
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

// Success Response (201)
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Error Responses
// 400 - Validation error
{
  "success": false,
  "error": "Password must be at least 6 characters",
  "code": "VALIDATION_ERROR"
}

// 409 - Email already registered
{
  "success": false,
  "error": "Email already registered",
  "code": "USER_EXISTS"
}

// 503 - Database unavailable
{
  "success": false,
  "error": "Database service temporarily unavailable",
  "code": "DB_UNAVAILABLE"
}

// 500 - Server error
{
  "success": false,
  "error": "Registration failed due to server error",
  "code": "INTERNAL_ERROR"
}
```

### 2️⃣ Login User

```javascript
// Request
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Success Response (200)
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Error Responses
// 400 - Missing fields
{
  "success": false,
  "error": "Email is required",
  "code": "VALIDATION_ERROR"
}

// 401 - Invalid credentials
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}

// 503 - Database unavailable
{
  "success": false,
  "error": "Database service temporarily unavailable",
  "code": "DB_UNAVAILABLE"
}

// 500 - Server error
{
  "success": false,
  "error": "Login failed due to server error",
  "code": "INTERNAL_ERROR"
}
```

### 3️⃣ Health Check

```javascript
// Request
GET /api/health

// Response (200)
{
  "status": "healthy",
  "mongodb": "connected",
  "timestamp": "2026-01-06T10:30:00.000Z",
  "environment": "production",
  "uptime": 3600
}
```

---

## 💾 Store Token in localStorage

```javascript
// After successful login/register
const response = await axios.post('/api/auth/login', { email, password });

if (response.data.success) {
  // Save token
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  // Redirect to dashboard
  navigate('/dashboard');
}
```

---

## 🔐 Use Token in Protected Routes

```javascript
// Axios automatically includes token in headers (see src/api/index.js)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ⚠️ Error Handling Best Practices

```javascript
try {
  const response = await api.post('/api/auth/login', {
    email: email,
    password: password,
  });

  if (response.data.success) {
    // Success case - response has token and user data
    localStorage.setItem('token', response.data.token);
    console.log('✓ Login successful:', response.data.user.name);
  }
} catch (error) {
  const status = error.response?.status;
  const errorData = error.response?.data;

  switch (status) {
    case 400:
      // Validation error
      console.error('Invalid input:', errorData.error);
      showToast(errorData.error, 'error');
      break;

    case 401:
      // Invalid credentials
      console.error('Login failed:', errorData.error);
      showToast('Invalid email or password', 'error');
      break;

    case 409:
      // Email already exists (register only)
      console.error('Email already registered');
      showToast('Email is already registered', 'error');
      break;

    case 503:
      // Database unavailable
      console.error('Server temporarily unavailable');
      showToast('Server is temporarily unavailable. Try again later.', 'warning');
      break;

    case 504:
      // Request timeout (rare, 25s server timeout)
      console.error('Request timeout');
      showToast('Request timed out. Check your connection.', 'error');
      break;

    default:
      // Server error
      console.error('Server error:', status, errorData);
      showToast('An error occurred. Please try again.', 'error');
  }
}
```

---

## 🎯 Form Validation (Frontend)

```javascript
// Before sending to backend - validate on frontend too
function validateRegisterForm(formData) {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Valid email is required';
  }

  // Password validation
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return Object.keys(errors).length === 0 ? null : errors;
}

function validateLoginForm(formData) {
  const errors = {};

  if (!formData.email || formData.email.trim().length === 0) {
    errors.email = 'Email is required';
  }

  if (!formData.password || formData.password.length === 0) {
    errors.password = 'Password is required';
  }

  return Object.keys(errors).length === 0 ? null : errors;
}

// Usage in component
const handleRegister = async (e) => {
  e.preventDefault();

  // Frontend validation first
  const validationErrors = validateRegisterForm(formData);
  if (validationErrors) {
    setErrors(validationErrors);
    return;
  }

  // Then call backend
  try {
    const response = await api.post('/api/auth/register', formData);
    // Handle success...
  } catch (error) {
    // Handle error...
  }
};
```

---

## 🔍 Debugging Tips

### Check Backend Connection
```javascript
// Add this to test in browser console
const response = await fetch('http://23.22.102.15:5000/api/health');
const data = await response.json();
console.log(data);
```

### Enable Detailed Logging
```javascript
// In src/api/index.js, logs are already configured
// Look for "API Request:" and "API Response:" in console
```

### Test Endpoint with curl (Development)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Health Check
curl http://localhost:5000/api/health
```

---

## 🚀 CORS Issues (Debugging)

### If you see CORS errors in browser:
1. Check `.env` has correct `VITE_API_BASE_URL`
2. Verify backend `CORS_ORIGIN` includes your frontend URL
3. Check request headers include `Content-Type: application/json`
4. Verify Authorization header format: `Bearer <token>`

### CORS is already configured for:
- `http://localhost:3000` (dev)
- `http://localhost:5173` (Vite dev)
- `http://127.0.0.1:3000` (alt dev)
- `http://127.0.0.1:5173` (alt dev)
- `http://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com` (production)
- `https://hotel-frontend-krishna.s3-website-us-east-1.amazonaws.com` (production)

---

## 📊 Response Status Codes

| Code | Meaning | When | Action |
|------|---------|------|--------|
| 200 | Success | Login succeeded | Store token, redirect |
| 201 | Created | Register succeeded | Store token, redirect |
| 400 | Bad Request | Invalid input | Show validation error |
| 401 | Unauthorized | Wrong password | Ask to login again |
| 403 | Forbidden | Token invalid | Clear storage, ask to login |
| 409 | Conflict | Email exists | Suggest login instead |
| 500 | Server Error | Backend error | Show "try again later" |
| 503 | Unavailable | DB down | Show "service unavailable" |
| 504 | Timeout | Request too slow | Show "timeout" |

---

## ✅ Testing Checklist

- [ ] Register with valid data → token received
- [ ] Register with existing email → 409 error
- [ ] Register with short password → 400 error
- [ ] Login with correct credentials → token received
- [ ] Login with wrong password → 401 error
- [ ] Health check returns 200
- [ ] Token stored in localStorage
- [ ] Protected routes use token in headers
- [ ] Logout clears token from storage

---

## 📞 Troubleshooting

### Login times out (axios 10s timeout)
**Cause:** Backend not responding  
**Fix:** 
- Check `/api/health` endpoint
- Verify EC2 instance is running
- Check MongoDB connection in backend logs
- Verify security groups allow port 5000

### Register times out
**Cause:** Same as login  
**Fix:** Same as above

### CORS error in browser console
**Cause:** Frontend origin not whitelisted  
**Fix:**
- Check backend `.env` CORS_ORIGIN
- Restart backend server
- Clear browser cache
- Check S3 frontend URL

### Token not sent in requests
**Cause:** localStorage not saving token  
**Fix:**
- Check `localStorage.setItem('token', ...)` is called
- Verify localStorage not cleared by user
- Check axios interceptor in `src/api/index.js`

### Axios timeout 10s exceeded
**Cause:** Backend responding too slowly  
**Fix:**
- Server timeout is now 25s (backend)
- Check database performance
- Check network latency to EC2

---

## 🎓 Code Examples

### Complete Login Component
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/api/auth/login', formData);

      if (response.data.success) {
        // Save auth data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      const errorCode = error.response?.data?.code;

      if (errorCode === 'INVALID_CREDENTIALS') {
        setErrors({ general: 'Invalid email or password' });
      } else if (error.response?.status === 400) {
        setErrors({ general: error.response.data.error });
      } else if (error.response?.status === 503) {
        setErrors({ general: 'Server temporarily unavailable' });
      } else if (error.code === 'ECONNABORTED') {
        setErrors({ general: 'Request timeout. Check your connection.' });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {errors.general && <p className="error">{errors.general}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🔗 Links

- **Backend Deployment Guide:** [PRODUCTION_DEPLOYMENT_GUIDE.md](../PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Backend Fix Summary:** [BACKEND_FIX_SUMMARY.md](../BACKEND_FIX_SUMMARY.md)
- **API Documentation:** [API_DOCUMENTATION.csv](../API_DOCUMENTATION.csv)
- **Backend Repo:** `backend/server-production-verified.js`
- **Frontend Repo:** `frontend-react/`

---

**Last Updated:** January 6, 2026  
**Status:** ✅ Ready to Integrate  
**Backend Version:** 2.0
