// frontend/src/api/axios.js
import axios from 'axios';

/**
 * Konfigurasi Axios ALSIO
 *
 * - Di Vercel: baseURL otomatis pakai '/api' karena rewrite sudah handle routing
 * - Di lokal:  VITE_API_URL diisi 'http://localhost:5000' di file .env
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
// Selalu attach token dari localStorage ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        console.warn('Sesi berakhir. Membersihkan data login...');
        ['token', 'user', 'username', 'userImage', 'xp', 'email'].forEach((key) =>
          localStorage.removeItem(key)
        );
        window.location.href = '/login';
      }
    }

    if (response) {
      console.error(`[API Error ${response.status}]:`, response.data?.message || response.data);
    } else if (error.request) {
      console.error('[Network Error]: Tidak ada respon dari server. Cek koneksi atau CORS.');
    }

    return Promise.reject(error);
  }
);

export default api;