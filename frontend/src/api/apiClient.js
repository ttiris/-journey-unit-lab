import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
});

// Add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ============ Auth APIs ============
export const authAPI = {
  register: (email, username, password) => 
    apiClient.post('/auth/register', { email, username, password }),
  
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  getMe: () => 
    apiClient.get('/auth/me')
};

// ============ Asset APIs ============
export const assetAPI = {
  create: (data) => {
    const config = data instanceof FormData ? {} : {};
    return apiClient.post('/assets/upload', data, config);
  },

  getAll: (page = 1, limit = 10) => 
    apiClient.get('/assets', { params: { page, limit } }),
  
  getById: (id) => 
    apiClient.get(`/assets/${id}`),
  
  update: (id, data) => 
    apiClient.put(`/assets/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/assets/${id}`)
};

// ============ Search APIs ============
export const searchAPI = {
  search: (params) => 
    apiClient.get('/search/assets', { params }),
  
  getTags: () => 
    apiClient.get('/search/tags')
};

// ============ Inspiration APIs ============
export const inspirationAPI = {
  generate: (assetIds, title) => 
    apiClient.post('/inspiration/generate', { asset_ids: assetIds, title }),
  
  getAll: (page = 1, limit = 10, savedOnly = false) => 
    apiClient.get('/inspiration', { params: { page, limit, saved: savedOnly } }),
  
  getById: (id) => 
    apiClient.get(`/inspiration/${id}`),
  
  save: (id, saved) => 
    apiClient.patch(`/inspiration/${id}/save`, { saved }),
  
  delete: (id) => 
    apiClient.delete(`/inspiration/${id}`)
};

export default apiClient;
