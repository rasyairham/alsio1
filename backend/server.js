const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:5173', 
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
const notificationRoutes = require('./routes/notificationRoutes'); // TAMBAHKAN INI

// 3. REGISTER ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes); // TAMBAHKAN INI AGAR 404 HILANG

// Health Check
app.get('/', (req, res) => {
  res.send('🚀 ALSIO API is Running...');
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File too large! Maximum size is 10MB.' });
  }
  
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An internal server error occurred.' });
});

// 5. DATABASE CONNECTION
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ DATABASE CONNECTED (ALSIO CLOUD)');
    app.listen(PORT, () => {
      console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ FAILED TO CONNECT DB:', err.message));