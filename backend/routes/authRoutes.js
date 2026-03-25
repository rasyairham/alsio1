const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth'); // Make sure the path is correct
const authController = require('../controllers/authController');

// --- 1. REGISTRATION & OTP ---
router.post('/send-otp', authController.sendOTP);
router.post('/register', authController.register);

// --- 2. FORGOT PASSWORD (RESET) ---
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// --- 3. LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Ensure payload uses 'id' to work with protect middleware
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      return res.json({ 
        token,
        username: user.username, 
        email: user.email,
        profileImage: user.profileImage || "" 
      });
    } else {
      return res.status(401).json({ message: "Incorrect password!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. GET USER DATA (PREVENT 404) ---
// This endpoint is required for Dashboard to display XP & Streak
router.get('/me', protect, async (req, res) => {
  try {
    // req.user comes from the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found!" });
    
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
      { new: true, runValidators: true } 
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ message: "User not found!" });
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;