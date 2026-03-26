import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' diatur ke '/' agar rute dashboard/login tidak bingung mencari file CSS/JS
  base: '/', 
  server: {
    proxy: {
      // Proxy ini HANYA jalan di npm run dev (lokal)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Pastikan output build masuk ke folder dist
    outDir: 'dist',
    // Membersihkan folder dist setiap kali build agar tidak ada file sampah
    emptyOutDir: true,
  }
})