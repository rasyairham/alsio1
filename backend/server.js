const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARE
// PERBAIKAN: Izinkan domain Vercel kamu agar tidak terkena blokir CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://alsio.vercel.app', // Ganti dengan domain Vercel aslimu
    /\.vercel\.app$/           // Izinkan semua sub-domain vercel
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 3. REGISTER ROUTES
// PERBAIKAN: Pastikan route ini sesuai dengan pemanggilan di frontend (api.js)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', message: '🚀 ALSIO API is Running...' });
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File too large! Maximum size is 10MB.' });
  }
  
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 5. DATABASE CONNECTION & SERVER START
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI; // Support kedua penamaan

// PERBAIKAN: Optimasi koneksi untuk Vercel (mencegah ENOTFOUND)
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik jika DNS gagal
})
  .then(() => {
    console.log('✅ DATABASE CONNECTED (ALSIO CLOUD)');
    // Penting: app.listen biasanya hanya untuk LOCAL. 
    // Di Vercel, module.exports = app lebih diutamakan.
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ FAILED TO CONNECT DB:', err.message);
  });

// Export untuk Vercel Serverless Function
module.exports = app;