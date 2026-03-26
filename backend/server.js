const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://alsio.vercel.app', // Sesuaikan dengan domain frontend kamu
    /\.vercel\.app$/           
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. DATABASE CONNECTION (Pattern untuk Serverless)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Kita buat fungsi koneksi tapi TIDAK membungkus routing di dalamnya
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Jika sudah konek, abaikan
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ DATABASE CONNECTED (ALSIO CLOUD)');
  } catch (err) {
    console.error('❌ FAILED TO CONNECT DB:', err.message);
  }
};

// Jalankan koneksi secara background
connectDB();

// 3. IMPORT & REGISTER ROUTES
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    message: '🚀 ALSIO API is Running...',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected'
  });
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File too large! Max 10MB.' });
  }
  
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 5. SERVER LISTEN (Hanya untuk Lokal)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
  });
}

// WAJIB: Export app untuk Vercel
module.exports = app;