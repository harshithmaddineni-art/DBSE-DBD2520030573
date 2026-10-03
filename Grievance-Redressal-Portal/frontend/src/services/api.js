import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  try {
    const data = localStorage.getItem('portal_user');
    if (data) {
      const user = JSON.parse(data);
      if (user && user.role) {
        config.headers['x-user-role'] = user.role;
      }
      if (user && user._id) {
        config.headers['x-user-id'] = user._id;
      }
    }
  } catch {
    // Ignore error
  }
  return config;
});

// Response interceptor for central error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred with the server request';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default API;
