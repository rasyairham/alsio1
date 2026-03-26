import axios from 'axios';

/**
 * Konfigurasi Instance Axios ALSIO - Optimized for Vercel & Refresh Persistence
 */
const api = axios.create({
  // Jika pakai Vercel Rewrites, gunakan '/api'
  // Jika langsung ke backend, gunakan URL lengkap (misal: https://api-alsio.vercel.app)
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, 
  withCredentials: true, 
});

/**
 * INTERCEPTOR REQUEST
 * Kunci agar saat REFRESH, token selalu nempel di header
 */
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

/**
 * INTERCEPTOR RESPONSE
 * Menangani error 401 (Token Expired/Invalid) secara bersih
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Jika Unauthorized (401), hapus SEMUA jejak login
    if (response && response.status === 401) {
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/'];

      if (!authPaths.includes(currentPath)) {
        console.warn("Sesi berakhir atau token tidak valid. Membersihkan data...");
        
        // Hapus semua key yang kita gunakan di ProfilePage
        const keysToRemove = ['token', 'user', 'username', 'userImage', 'xp', 'email'];
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Opsional: Redirect ke login jika bukan di halaman landing
        // window.location.href = '/login'; 
      }
    }

    // Log Error untuk Reyfan (Bantu Debugging di Production)
    if (response) {
      console.error(`[Backend Error ${response.status}]:`, response.data.message || response.data);
    } else if (error.request) {
      console.error("[Network Error]: Tidak ada respon dari server. Cek koneksi atau CORS.");
    }

    return Promise.reject(error);
  }
);

export default api;