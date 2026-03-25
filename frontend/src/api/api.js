import axios from 'axios';

const api = axios.create({
  // baseURL '/api' akan otomatis diarahkan oleh vercel.json ke backend kamu
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Token JWT secara otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;