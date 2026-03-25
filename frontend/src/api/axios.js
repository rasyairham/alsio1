import axios from 'axios';

const api = axios.create({
  // baseURL ini otomatis akan nambahin '/api' di depan setiap request kamu
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis selipin Token JWT ke Header (biar ngga manual di setiap page)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;