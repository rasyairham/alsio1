const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: 6 // removed custom error message
  },
  profileImage: { type: String, default: "" },
  
  // --- GAMIFICATION STATISTICS (ALSIO SYSTEM) ---
  xp: { 
    type: Number, 
    default: 0,
    min: [0, "XP cannot be negative"] 
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

// --- MIDDLEWARE: HASH PASSWORD BEFORE SAVE ---
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; 
  }
});

// Method to verify password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);