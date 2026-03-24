const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Nama quest wajib diisi'],
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: "General"
  },
  xp: {
    type: Number,
    default: 100
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline wajib diisi']
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

// INI BAGIAN PALING PENTING. Jangan sampai salah tulis!
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;