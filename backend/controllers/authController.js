const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LOGIN (Kirim Profile Image ke Frontend)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Kirim data lengkap ke frontend
    res.json({
      token,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage // Agar foto tidak hilang saat login
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE PROFILE (Simpan Foto & Nama secara Permanen)
exports.updateProfile = async (req, res) => {
  try {
    const { username, profileImage, email } = req.body;
    
    // Cari user berdasarkan email
    const user = await User.findOneAndUpdate(
      { email: email },
      { username, profileImage },
      { new: true } // Mengembalikan data yang sudah diupdate
    );

    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    res.json({
      message: "Profil diperbarui",
      username: user.username,
      profileImage: user.profileImage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};