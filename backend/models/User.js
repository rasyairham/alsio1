const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username wajib diisi"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email wajib diisi"], 
    unique: true,
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, "Password wajib diisi"],
    minlength: [6, "Password minimal 6 karakter"] 
  },
  profileImage: { type: String, default: "" },
  
  // --- STATISTIK GAMIFIKASI (ALSIO SYSTEM) ---
  xp: { 
    type: Number, 
    default: 0,
    min: [0, "XP tidak boleh negatif"] 
  },
  streak: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalTasksDone: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  lastCompletedDate: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// --- MIDDLEWARE: HASH PASSWORD SEBELUM SIMPAN ---
userSchema.pre('save', async function(next) {
  // Jika password tidak dimodifikasi, langsung lanjut
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // PENTING: Panggil next() di sini agar Mongoose tahu proses async selesai
    next(); 
  } catch (error) {
    // Jika ada error saat hashing, kirim error ke middleware Express
    return next(error); 
  }
});

// Method untuk verifikasi password saat login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);