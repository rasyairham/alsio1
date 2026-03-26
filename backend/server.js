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
    'https://alsio.vercel.app', 
    /\.vercel\.app$/           
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Tambahkan ini untuk menghindari 405
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. DATABASE CONNECTION (Optimized)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ DATABASE CONNECTED');
  } catch (err) {
    console.error('❌ DB CONNECTION ERROR:', err.message);
  }
};

// Middleware untuk memastikan koneksi DB di setiap request API
const dbMiddleware = async (req, res, next) => {
  await connectDB();
  next();
};

// 3. IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 4. REGISTER ROUTES
// Gunakan middleware tunggal agar kode lebih bersih
app.use('/api/auth', dbMiddleware, authRoutes);
app.use('/api/tasks', dbMiddleware, taskRoutes);
app.use('/api/notifications', dbMiddleware, notificationRoutes);

// Health Check
app.get('/api', dbMiddleware, (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 5. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File too large! Max 10MB.' });
  }
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 6. SERVER LISTEN (Lokal saja)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    await connectDB();
  });
}

module.exports = app;