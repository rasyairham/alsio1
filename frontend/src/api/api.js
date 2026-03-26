import axios from 'axios';

/**
 * Konfigurasi Instance Axios untuk ALSIO
 */
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  // Tetap mempertahankan konsep awal: Local vs Production (Vercel)
  baseURL: isLocal ? 'http://localhost:5000/api' : '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  // TAMBAHAN KRUSIAL: Agar cookies/authorization headers terkirim dengan aman di Vercel
  withCredentials: true, 
});

// Interceptor Request: Otomatis menyisipkan Token JWT
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
 * Interceptor Response: Menangani Error secara Global
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const noRedirectPaths = ['/login', '/register', '/'];
      
      if (!noRedirectPaths.includes(currentPath)) {
        console.warn("Sesi berakhir. Mengarahkan ke login...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    if (error.response) {
      // Log lebih detail jika 405 (Salah rute vercel.json) atau 404
      console.error(`API Error (${error.response.status}):`, error.response.data?.message || "Server Error");
    } else if (error.code === 'ECONNABORTED') {
      console.error("Timeout: Database Atlas atau Vercel lambat merespon.");
    } else {
      console.error("Network Error: Cek koneksi internet atau status server.");
    }

    return Promise.reject(error);
  }
);

export default api;