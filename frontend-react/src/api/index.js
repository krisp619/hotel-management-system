import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

console.log('🚀 API Configuration:');
console.log('   Base URL:', API_BASE_URL);
console.log('   Timeout: 30 seconds');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for production stability
});

// Request interceptor: Add token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      data: config.data,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and auth failures
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    // Comprehensive error logging
    console.error('❌ API Error Details:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.message);
    console.error('   Data:', error.response?.data);
    console.error('   URL:', error.config?.url);
    console.error('   Method:', error.config?.method);
    
    // Timeout detection
    if (error.code === 'ECONNABORTED') {
      console.error('   Type: REQUEST TIMEOUT (30s exceeded)');
    } else if (!error.response) {
      console.error('   Type: NETWORK ERROR (no response from server)');
    } else {
      console.error('   Type: API ERROR');
    }

    // Handle 403 Forbidden - token expired
    if (error.response?.status === 403) {
      console.warn('🔐 Token expired - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const bookingAPI = {
  createBooking: (data) => api.post('/book-room', data),
  getBookings: (page = 1, limit = 10) =>
    api.get('/bookings', { params: { page, limit } }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
