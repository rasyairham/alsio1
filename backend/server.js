// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

// ─────────────────────────────────────────────
// 1. CORS — izinkan frontend Vercel & localhost
// ─────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://alsio.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman, server-to-server) dan yang ada di whitelist
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} tidak diizinkan`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Tangani preflight OPTIONS secara eksplisit
app.options('*', cors());

// ─────────────────────────────────────────────
// 2. BODY PARSING & LOGGING
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─────────────────────────────────────────────
// 3. DATABASE — persistent connection di serverless
// ─────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Simpan promise koneksi agar tidak double-connect di warm lambda
let connectionPromise = null;

const connectDB = () => {
  // Sudah tersambung — langsung return
  if (mongoose.connection.readyState === 1) return Promise.resolve();

  // Ada koneksi yang sedang berjalan — tunggu
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log('✅ MongoDB Connected');
      connectionPromise = null;
    })
    .catch((err) => {
      console.error('❌ MongoDB Error:', err.message);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

// Middleware DB — dipanggil di setiap route API
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database tidak tersedia. Coba lagi.' });
  }
};

// ─────────────────────────────────────────────
// 4. ROUTES
// ─────────────────────────────────────────────
const authRoutes         = require('./routes/authRoutes');
const taskRoutes         = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth',          dbMiddleware, authRoutes);
app.use('/api/tasks',         dbMiddleware, taskRoutes);
app.use('/api/notifications', dbMiddleware, notificationRoutes);

// Health check — bisa dipakai untuk tes DB dari browser
app.get('/api/health', dbMiddleware, (req, res) => {
  res.status(200).json({
    status: 'active',
    env: process.env.NODE_ENV,
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// ─────────────────────────────────────────────
// 5. GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File terlalu besar! Max 10MB.' });
  }
  if (err.message?.startsWith('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('Internal Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error.',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  });
});

// ─────────────────────────────────────────────
// 6. LISTEN — hanya di lokal, bukan di Vercel
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    await connectDB();
  });
}

// Export app untuk Vercel Serverless
module.exports = app;