import axios from 'axios';

// Buat instance axios
const api = axios.create({
  /**
   * PERBAIKAN: Gunakan Environment Variable.
   * Di lokal (Laptop), dia akan pakai http://localhost:5000/api.
   * Di Vercel, dia akan pakai URL Backend yang kamu setting di Dashboard Vercel.
   */
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis selipin Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * TAMBAHAN: Interceptor Response (Opsional tapi Penting)
 * Jika token kadaluarsa (401), otomatis logout atau arahkan ke login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;