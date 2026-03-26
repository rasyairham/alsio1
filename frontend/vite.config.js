import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Gunakan base: './' atau '/' untuk memastikan path relatif aset benar
  base: '/', 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Menghindari error chunk yang terlalu besar yang kadang bikin lag/white screen
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Memastikan nama file aset tetap konsisten
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})