const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task name is required'],
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
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

// THIS IS THE MOST IMPORTANT PART. Do not misspell!
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;