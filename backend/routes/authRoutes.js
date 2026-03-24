const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth'); // Pastikan path ini benar
const authController = require('../controllers/authController');

// --- 1. REGISTRASI & OTP ---
router.post('/send-otp', authController.sendOTP);
router.post('/register', authController.register);

// --- 2. LUPA PASSWORD (RESET) ---
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- 3. LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email tidak ditemukan!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Pastikan payload menggunakan 'id' agar nyambung dengan middleware protect
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      return res.json({ 
        token,
        username: user.username, 
        email: user.email,
        profileImage: user.profileImage || "" 
      });
    } else {
      return res.status(401).json({ message: "Password salah!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. GET DATA USER (SOLUSI ERROR 404) ---
// Endpoint ini wajib ada agar Dashboard bisa menampilkan XP & Streak
router.get('/me', protect, async (req, res) => {
  try {
    // req.user didapat dari middleware protect yang sudah kita perbaiki tadi
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. UPDATE PROFILE ---
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { username, profileImage },
      { new: true } 
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ message: "User tidak ditemukan" });
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;