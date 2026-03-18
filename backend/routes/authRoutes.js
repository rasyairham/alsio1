const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "Berhasil Regis!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. LOGIN (Pastikan path-nya '/login' huruf kecil semua)
router.post('/login', async (req, res) => {
  console.log("📥 Ada request login masuk untuk email:", req.body.email); // Log untuk pantau di terminal
  
  try {
    const { email, password } = req.body;
    
    // Cari user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login Gagal: Email tidak terdaftar");
      return res.status(401).json({ message: "Email tidak ditemukan!" });
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Hasil cek password:", isMatch);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ 
        message: "Berhasil",
        username: user.username, 
        token 
      });
    } else {
      return res.status(401).json({ message: "Password salah!" });
    }
    
  } catch (err) {
    console.error("🔥 Error di Backend:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;