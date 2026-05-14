import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:5000/api';
const rawBaseURL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, '');
const baseURL = normalizedBaseURL.endsWith('/api')
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aiTicketToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
