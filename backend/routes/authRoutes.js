const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.status(201).json({ message: "Berhasil Registrasi!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. LOGIN (Kirim data lengkap ke Frontend)
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

// 3. UPDATE PROFILE
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { username, profileImage },
      { returnDocument: 'after' } 
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