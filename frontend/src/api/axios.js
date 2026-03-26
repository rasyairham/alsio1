import axios from 'axios';

/**
 * Konfigurasi Instance Axios ALSIO - Versi Stabil Vercel
 */
const api = axios.create({
  // Gunakan jalur relatif agar Vercel Proxy bekerja otomatis
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, 
  withCredentials: true, 
});

// Interceptor Request: Memastikan token dikirim dengan format yang benar
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Pastikan format "Bearer <token>" tidak ada typo
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor Response: Menangani Error & Debugging
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika Unauthorized (401), bersihkan storage kecuali di halaman auth
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/'];
      
      if (!authPaths.includes(currentPath)) {
        console.warn("Sesi berakhir, silakan login kembali.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Jangan langsung redirect agar tidak looping error, user bisa klik login manual
      }
    }
    
    // Log Error ke Console untuk Debugging Reyfan
    if (error.response) {
      console.error(`Backend Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error("No Response dari Backend. Cek Vercel Logs atau MongoDB IP Whitelist (0.0.0.0/0).");
    }
    
    return Promise.reject(error);
  }
);

export default api;