const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

let tempOTPs = new Map(); 

// --- 1. SEND OTP ---
exports.sendOTP = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    tempOTPs.set(email, {
      otp: otp,
      expires: Date.now() + 300000 // 5 minutes
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
    res.status(200).json({ message: "OTP sent to your email!" });

  } catch (error) {
    next(error);
  }
};

// --- 2. REGISTER ---
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, otp } = req.body;

    const storedData = tempOTPs.get(email);
    if (!storedData) return res.status(400).json({ message: "Request OTP first!" });
    
    if (Date.now() > storedData.expires) {
      tempOTPs.delete(email);
      return res.status(400).json({ message: "OTP has expired!" });
    }
    
    if (storedData.otp !== otp) return res.status(400).json({ message: "Incorrect OTP!" });

    const user = new User({ username, email, password }); 
    await user.save();

    tempOTPs.delete(email);
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    next(error); 
  }
};

// --- 3. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOTPs.set(email, { otp, expires: Date.now() + 300000 });

    const mailOptions = {
      from: `"ALSIO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password - ALSIO',
      html: `<div style="text-align:center;"><h2>Reset Code</h2><h1>${otp}</h1></div>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset OTP sent to your email!" });
  } catch (error) {
    next(error);
  }
};

// --- 4. RESET PASSWORD ---
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedData = tempOTPs.get(email);

    if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
      return res.status(400).json({ message: "OTP is incorrect or expired!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    user.password = newPassword; 
    await user.save(); 
    
    tempOTPs.delete(email);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

// --- 5. LOGIN ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password!" });

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
    next(error);
  }
};

// --- 6. UPDATE PROFILE ---
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, profileImage } = req.body;
    
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, profileImage },
      { returnDocument: 'after', runValidators: true } 
    );

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.json({
      success: true,
      message: "Profile updated successfully",
      username: user.username,
      profileImage: user.profileImage
    });
  } catch (error) {
    next(error);
  }
};

// --- 7. GET ME ---
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};