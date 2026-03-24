const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Cek header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Jika token tidak ada
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak, silakan login terlebih dahulu.",
      });
    }

    // 2. Verifikasi Token
    // Kita bungkus verify dalam try-catch internal atau biarkan ditangkap catch utama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Ambil data user
    // .lean() ditambahkan jika Anda hanya butuh data read-only untuk performa lebih cepat
    // .select('-password') sangat penting untuk keamanan
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User sudah tidak terdaftar atau token tidak valid.",
      });
    }

    // 4. Simpan ke request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    // Penanganan error JWT yang lebih spesifik
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Sesi Anda telah berakhir, silakan login ulang.",
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau rusak.",
      });
    }

    // Error umum lainnya
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat verifikasi akun.",
    });
  }
};

module.exports = { protect };