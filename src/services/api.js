import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to all requests
api.interceptors.request.use((config) => {
  const authStore = JSON.parse(localStorage.getItem('auth') || '{}');
  
  if (authStore.staffId && authStore.roleId) {
    // Format: "Bearer {staff_id}:{role_id}"
    config.headers.Authorization = `Bearer ${authStore.staffId}:${authStore.roleId}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  // Staff endpoints
  staff: {
    getAll: () => api.get('/staff'),
    getById: (id) => api.get(`/staff/${id}`),
    login: (credentials) => api.post('/staff/login', credentials),
    create: (data) => api.post('/staff', data),
    update: (id, data) => api.put(`/staff/${id}`, data),
    delete: (id) => api.delete(`/staff/${id}`),
  },

  // Transaction endpoints
  transactions: {
    getAll: () => api.get('/transactions'),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
  },

  // Customer endpoints
  customers: {
    getAll: () => api.get('/customers'),
    getById: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
  },

  // Analytics endpoints
  analytics: {
    getAll: () => api.get('/analytics'),
    getSummary: (startDate, endDate) => api.get(`/analytics/summary?start_date=${startDate}&end_date=${endDate}`),
    generate: (data) => api.post('/analytics', data),
  },

  // Edit logs endpoints
  editLogs: {
    getAll: () => api.get('/editlogs'),
    getByTransaction: (transactionId) => api.get(`/editlogs/transaction/${transactionId}`),
  },

  // Services endpoints
  services: {
    getAll: () => api.get('/services'),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
  },

  // Addons endpoints
  addons: {
    getAll: () => api.get('/addons'),
    getById: (id) => api.get(`/addons/${id}`),
    create: (data) => api.post('/addons', data),
    update: (id, data) => api.put(`/addons/${id}`, data),
    delete: (id) => api.delete(`/addons/${id}`),
  },
};
