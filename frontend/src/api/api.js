import axios from 'axios';

/**
 * Konfigurasi Instance Axios untuk ALSIO
 * baseURL '/api' akan diteruskan oleh vercel.json ke folder /backend/server.js
 */
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // Menghindari request "gantung" jika serverless function Vercel sedang cold start
  timeout: 15000, 
});

// Interceptor Request: Otomatis menyisipkan Token JWT dari localStorage
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
 * Interceptor Response: Menangani Error secara Global
 * Sangat berguna jika token expired atau server bermasalah (DB tidak masuk)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server merespon 401 (Unauthorized), biasanya token sudah tidak valid
    if (error.response && error.response.status === 401) {
      console.warn("Sesi berakhir atau token tidak valid. Mengarahkan ke login...");
      localStorage.clear(); // Bersihkan semua data agar tidak terjadi bentrok data user
      window.location.href = '/login';
    }
    
    // Memberikan log yang jelas di konsol browser untuk debugging deployment
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data.message || "Server Error");
    } else {
      console.error("Network Error: Tidak bisa terhubung ke Backend.");
    }

    return Promise.reject(error);
  }
);

export default api;