const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function() {
  // Jika password tidak berubah, langsung keluar (tanpa next)
  if (!this.isModified('password')) return;
  
  // Lakukan hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Di versi async, kita TIDAK memanggil next()
});

module.exports = mongoose.model('User', userSchema);