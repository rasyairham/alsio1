import axios from 'axios';

/**
 * Konfigurasi Instance Axios untuk ALSIO
 * Otomatis mendeteksi apakah sedang di Localhost atau Vercel
 */
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const api = axios.create({
  // Tetap mempertahankan konsep awal: Local vs Production (Vercel)
  baseURL: isLocal ? 'http://localhost:5000/api' : '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // Dinaikkan sedikit ke 20s karena Serverless Vercel kadang butuh waktu "Cold Start"
});

// Interceptor Request: Otomatis menyisipkan Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Perbaikan: Gunakan backticks yang konsisten
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
    // Tangani 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      
      // PERBAIKAN: List halaman yang tidak boleh kena auto-redirect agar tidak loop
      const noRedirectPaths = ['/login', '/register', '/'];
      
      if (!noRedirectPaths.includes(currentPath)) {
        console.warn("Sesi berakhir. Mengarahkan ke login...");
        localStorage.removeItem('token'); // Hapus spesifik token saja lebih aman
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Log Error detail untuk debugging di Console Browser
    if (error.response) {
      // 405 Method Not Allowed biasanya karena masalah routing di vercel.json
      if (error.response.status === 405) {
        console.error("Error 405: Cek vercel.json! Pastikan /api diarahkan ke backend/server.js");
      }
      console.error(`API Error (${error.response.status}):`, error.response.data?.message || "Server Error");
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request Timeout: Serverless function Vercel atau DB Atlas sedang lambat.");
    } else {
      console.error("Network Error: Cek apakah Backend sudah ter-deploy dengan benar!");
    }

    return Promise.reject(error);
  }
);

export default api;