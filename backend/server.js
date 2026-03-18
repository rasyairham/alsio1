const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));

// KONEKSI DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DATABASE TERHUBUNG (ALSIO CLOUD)'))
  .catch((err) => console.log('❌ GAGAL KONEK:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));