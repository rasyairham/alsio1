import axios from 'axios';

/**
 * Konfigurasi Instance Axios untuk ALSIO
 * Otomatis mendeteksi apakah sedang di Localhost atau Vercel
 */
const isLocal = window.location.hostname === 'localhost';

const api = axios.create({
  // PERBAIKAN: Jika local, tembak port 5000. Jika produksi, pakai path '/api'
  baseURL: isLocal ? 'http://localhost:5000/api' : '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

// Interceptor Request: Otomatis menyisipkan Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Pastikan format "Bearer " memiliki spasi yang benar
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
    // 401: Token Expired / Invalid
    if (error.response && error.response.status === 401) {
      // Hanya redirect jika bukan di halaman login untuk menghindari loop
      if (window.location.pathname !== '/login') {
        console.warn("Sesi berakhir. Mengarahkan ke login...");
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    // Log Error yang lebih detail untuk membantu debugging Dashboard
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data.message || "Server Error");
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request Timeout: Server kelamaan mikir (cek koneksi DB).");
    } else {
      console.error("Network Error: Pastikan Backend di port 5000 sudah jalan!");
    }

    return Promise.reject(error);
  }
);

export default api;