const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController'); // Import controller untuk OTP

// 1. SEND OTP (Tambahan Baru)
// Dipanggil saat user klik "GET VERIFIED"
router.post('/send-otp', authController.sendOTP);

// 2. REGISTER (Diperbarui untuk mendukung OTP)
// Menggunakan logika dari controller agar verifikasi OTP berjalan
router.post('/register', authController.register);

// 3. LOGIN (Tetap sesuai konsep asli kamu)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email tidak ditemukan!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
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

// 4. UPDATE PROFILE (Tetap sesuai konsep asli kamu)
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { username, profileImage },
      { new: true } // Menggunakan 'new: true' agar mengembalikan data terbaru
    );
    
    if (!updatedUser) return res.status(404).json({ message: "User tidak ditemukan" });
    
    res.json({ 
      username: updatedUser.username, 
      profileImage: updatedUser.profileImage 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;