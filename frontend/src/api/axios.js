import axios from 'axios';

/**
 * PERBAIKAN: Gunakan relative path '/api'.
 * Dengan vercel.json 'rewrites', semua request ke /api akan otomatis
 * diteruskan ke /backend/server.js tanpa masalah CORS.
 */
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // Tambahkan timeout untuk menangani 'cold start' pada serverless function Vercel
  timeout: 15000, 
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
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor Response: Penanganan Error Global
 * Penting untuk mendeteksi kenapa DB tidak masuk atau sesi habis.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token tidak valid atau expired (401)
    if (error.response && error.response.status === 401) {
      console.warn("Sesi berakhir. Membersihkan data...");
      // Gunakan clear() agar semua data user (XP, Username, Image) ikut terhapus
      localStorage.clear(); 
      window.location.href = '/login';
    }

    // Log error spesifik untuk mempermudah debugging saat di-deploy
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data.message || "Server Error");
    } else {
      console.error("Network Error: Pastikan backend di Vercel sudah berjalan.");
    }

    return Promise.reject(error);
  }
);

export default api;