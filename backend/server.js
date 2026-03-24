const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Konfigurasi Environment (Wajib di paling atas)
dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());

// Limit 10mb sangat penting agar upload Base64 Profile Image dari Frontend tidak Error 413
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ROUTES ---
// Pastikan rute '/api/auth' sudah mengarah ke authRoutes yang kita perbaiki tadi
app.use('/api/auth', require('./routes/authRoutes'));

// Route Testing (Opsional)
app.get('/', (req, res) => res.send('ALSIO Backend API is Running...'));

// --- KONEKSI DATABASE ---
// Menambahkan opsi konfigurasi mongoose standar agar lebih stabil
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DATABASE TERHUBUNG (ALSIO CLOUD)'))
  .catch((err) => {
    console.error('❌ GAGAL KONEK KE DATABASE:');
    console.error(err.message);
  });

// --- RUN SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SERVER ALSIO RUNNING ON PORT ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});