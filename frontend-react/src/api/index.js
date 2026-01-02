import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
