import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  // Tambahkan ini untuk memastikan build directory sesuai dengan vercel.json
  build: {
    outDir: 'dist', 
  }
})