import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authService = {
  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    axiosInstance.post('/auth/register', { name, email, password })
};

export const slotService = {
  getSlots: (date) =>
    axiosInstance.get('/slots', { params: { date } }),
  bookSlot: (slotId, date) =>
    axiosInstance.post('/slots/book', { slotId, date }),
  cancelBooking: (bookingId) =>
    axiosInstance.post(`/bookings/${bookingId}/cancel`, {}),
  getAllSlots: () =>
    axiosInstance.get('/slots/all'),
  resetAllSlots: () =>
    axiosInstance.post('/slots/reset', {}),
  updateSlotStatus: (slotId, status) =>
    axiosInstance.put(`/slots/${slotId}`, { status })
};

export const bookingService = {
  getUserBookings: () =>
    axiosInstance.get('/bookings/user'),
  getAllBookings: () =>
    axiosInstance.get('/bookings/all'),
  getBookingDetails: (bookingId) =>
    axiosInstance.get(`/bookings/${bookingId}`),
  cancelBooking: (bookingId) =>
    axiosInstance.post(`/bookings/${bookingId}/cancel`, {})
};

export const userService = {
  getUsers: () =>
    axiosInstance.get('/users'),
  getUserDetails: (userId) =>
    axiosInstance.get(`/users/${userId}`),
  updateUser: (userId, data) =>
    axiosInstance.put(`/users/${userId}`, data)
};

export default axiosInstance;
