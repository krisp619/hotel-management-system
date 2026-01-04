import axios from 'axios';

// Get and clean API base URL (remove newline characters and trim whitespace)
const getRawURL = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = getRawURL().trim(); // Remove any whitespace/newlines

console.log('API_BASE_URL configured:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    // Handle 403 Forbidden - token expired
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const bookingAPI = {
  createBooking: (data) => api.post('/api/book-room', data),
  getBookings: (page = 1, limit = 10) =>
    api.get('/api/bookings', { params: { page, limit } }),
  getBookingById: (id) => api.get(`/api/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/api/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/api/bookings/${id}`),
};

export const healthAPI = {
  check: () => api.get('/api/health'),
};

export default api;
