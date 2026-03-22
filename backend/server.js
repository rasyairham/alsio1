const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

app.use(cors());

// PERBAIKAN DI SINI: Tambahkan limit 10mb agar foto tidak ditolak
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));

// KONEKSI DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DATABASE TERHUBUNG (ALSIO CLOUD)'))
  .catch((err) => console.log('❌ GAGAL KONEK:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));