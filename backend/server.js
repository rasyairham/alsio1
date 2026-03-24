const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

// 1. MIDDLEWARE GLOBAL
app.use(cors({
  origin: 'http://localhost:5173', // Sesuaikan dengan port Vite/Frontend kamu
  credentials: true
}));

// --- PERBAIKAN DI SINI ---
// Tambahkan limit (misal 10mb) agar bisa menerima upload foto profil yang berukuran besar
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// -------------------------

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// 3. REGISTER ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 ALSIO API is Running...');
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  // Jika error karena payload terlalu besar, kirim pesan yang lebih spesifik
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Ukuran file terlalu besar! Maksimal 10MB.' });
  }
  
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

// 5. DATABASE CONNECTION
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ DATABASE TERHUBUNG (ALSIO CLOUD)');
    // Pindahkan app.listen ke luar atau biarkan di sini sudah benar
    app.listen(PORT, () => {
      console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ GAGAL KONEK DB:', err.message));