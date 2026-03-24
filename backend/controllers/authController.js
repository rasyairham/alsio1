const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- KONFIGURASI EMAIL ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Isi di file .env
    pass: process.env.EMAIL_PASS  // Isi dengan App Password Gmail di .env
  }
});

// Penyimpanan OTP sementara (In-Memory)
let tempOTPs = {}; 

// --- 1. SEND OTP (Kirim Kode ke Email) ---
exports.sendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi Password minimal 6 karakter
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter!" });
    }

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Generate 6 digit kode
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simpan OTP ke memori (berlaku 5 menit)
    tempOTPs[email] = {
      otp: otp,
      expires: Date.now() + 300000 // 5 Menit
    };

    const mailOptions = {
      from: `"ALSIO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verification Code - ALSIO Account',
      html: `
        <div style="font-family: 'Poppins', sans-serif; max-width: 400px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px;">
          <h2 style="color: #C17A3A; text-align: center;">Verify Your Account</h2>
          <p style="text-align: center; color: #4a5568;">Use the code below to complete your registration:</p>
          <div style="background: #FAF7F4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1a202c; border-radius: 15px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP terkirim ke email!" });

  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim email: " + error.message });
  }
};

// --- 2. REGISTER (Finalisasi dengan OTP) ---
exports.register = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // Validasi OTP
    const storedData = tempOTPs[email];
    if (!storedData) {
      return res.status(400).json({ message: "Silakan minta kode OTP terlebih dahulu" });
    }

    if (Date.now() > storedData.expires) {
      delete tempOTPs[email];
      return res.status(400).json({ message: "Kode OTP telah kedaluwarsa" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Kode OTP salah!" });
    }

    // Jika OTP benar, simpan user ke database
    const user = new User({ username, email, password });
    await user.save();

    // Hapus OTP dari memori setelah sukses
    delete tempOTPs[email];

    res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- 3. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- 4. UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
  try {
    const { username, profileImage, email } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email: email },
      { username, profileImage },
      { new: true }
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