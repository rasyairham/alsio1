const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- KONFIGURASI EMAIL ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// Gunakan Map untuk performa memori yang lebih baik daripada Object biasa
let tempOTPs = new Map(); 

// --- 1. SEND OTP ---
exports.sendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simpan ke Map
    tempOTPs.set(email, {
      otp: otp,
      expires: Date.now() + 300000 
    });

    const mailOptions = {
      from: `"ALSIO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verification Code - ALSIO Account',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px; text-align: center;">
          <h2 style="color: #C29976;">Verify Your Account</h2>
          <p style="color: #4a5568;">Use the code below to complete your registration:</p>
          <div style="background: #F8F5F2; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #111; border-radius: 15px; margin: 20px 0; border: 1px dashed #C29976;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #a0aec0;">This code will expire in 5 minutes.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP terkirim ke email!" });

  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim email: " + error.message });
  }
};

// --- 2. REGISTER ---
exports.register = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    const storedData = tempOTPs.get(email);
    if (!storedData) return res.status(400).json({ message: "Minta OTP terlebih dahulu!" });
    
    if (Date.now() > storedData.expires) {
      tempOTPs.delete(email);
      return res.status(400).json({ message: "OTP Kadaluwarsa!" });
    }
    
    if (storedData.otp !== otp) return res.status(400).json({ message: "OTP Salah!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    tempOTPs.delete(email); // Hapus setelah berhasil
    res.status(201).json({ message: "Registrasi Berhasil!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email tidak ditemukan!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOTPs.set(email, { otp, expires: Date.now() + 300000 });

    const mailOptions = {
      from: `"ALSIO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password - ALSIO',
      html: `
        <div style="font-family: sans-serif; text-align:center; padding: 20px;">
          <h2 style="color: #C29976;">Reset Password Code</h2>
          <h1 style="font-size: 40px; letter-spacing: 5px;">${otp}</h1>
          <p>Masukkan kode ini untuk mengganti password kamu.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP Reset dikirim ke email!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 4. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedData = tempOTPs.get(email);

    if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
      return res.status(400).json({ message: "OTP Salah atau Kadaluwarsa!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // MENGHILANGKAN WARNING: returnDocument: 'after'
    await User.findOneAndUpdate(
      { email }, 
      { password: hashedPassword },
      { returnDocument: 'after' }
    );
    
    tempOTPs.delete(email);
    res.status(200).json({ message: "Password berhasil diperbarui!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 5. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      xp: user.xp || 0,
      totalTasksDone: user.totalTasksDone || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 6. UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    
    // Pastikan req.user ada (dari middleware auth)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }

    // MENGHILANGKAN WARNING: returnDocument: 'after'
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, profileImage },
      { returnDocument: 'after', runValidators: true } 
    );

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({
      success: true,
      message: "Profil diperbarui",
      username: user.username,
      profileImage: user.profileImage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 7. GET ME ---
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};