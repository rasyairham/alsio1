const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

// --- 1. REGISTRATION & OTP ---
router.post('/send-otp', authController.sendOTP);
router.post('/register', authController.register);

// --- 2. FORGOT PASSWORD (RESET) ---
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- 3. LOGIN ---
// Tips: Sebaiknya logika ini dipindah ke authController.login agar rapi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Gunakan .select('+password') jika di model User kamu set password { select: false }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password!" });

    // Payload menggunakan 'id' agar sesuai dengan middleware 'protect'
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Kirim data user yang dibutuhkan frontend ALSIO
    return res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username, 
        email: user.email,
        xp: user.xp || 0, // Pastikan XP terkirim agar Dashboard tidak kosong
        totalTasksDone: user.totalTasksDone || 0,
        profileImage: user.profileImage || "" 
      }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. GET USER DATA ---
// Diperlukan untuk sinkronisasi XP, Streak, dan Username di Dashboard
router.get('/me', protect, async (req, res) => {
  try {
    // req.user.id didapat dari middleware protect
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found!" });
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 5. UPDATE PROFILE ---
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    
    // Update data dengan validasi
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { username, profileImage },
      { new: true, runValidators: true } 
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found!" });
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;