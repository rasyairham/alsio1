const Task = require('../models/Task');
const User = require('../models/User');

// --- 1. GET ALL TASKS ---
exports.getAllTasks = async (req, res) => {
  try {
    // Pastikan filter user ID benar
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: tasks.length, 
      data: tasks 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CREATE TASK ---
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, category, xp } = req.body;
    
    if (!title || !deadline) {
      return res.status(400).json({ success: false, message: "Title dan Deadline wajib diisi!" });
    }

    const newTask = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description || "",
      deadline: new Date(deadline),
      category: category || "General",
      xp: xp || 100, // Dinamis: bisa dikirim dari frontend atau default 100
      status: "pending" // Pastikan default string kecil sesuai filter frontend
    });

    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. COMPLETE TASK (CRITICAL FIX) ---
exports.completeTask = async (req, res) => {
  try {
    // 1. Cari Task milik user tersebut
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ success: false, message: "Quest tidak ditemukan" });
    }

    // 2. CEK STATUS: Jika sudah completed, jangan kasih XP lagi!
    if (task.status === "completed") {
      return res.status(400).json({ success: false, message: "Quest ini sudah pernah diklaim!" });
    }

    // 3. Update Status Task
    task.status = "completed";
    await task.save();

    // 4. Update User XP & Stats
    const xpReward = Number(task.xp) || 100;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xp: xpReward, totalTasksDone: 1 } },
      { new: true, runValidators: true } // Menggunakan new: true untuk mendapatkan data terbaru
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // 5. Kirim Response Lengkap
    res.status(200).json({ 
      success: true, 
      message: `Quest Clear! +${xpReward} XP`, 
      data: task, // Kirim task yang terupdate agar frontend bisa update state
      userStats: {
        xp: updatedUser.xp,
        totalTasksDone: updatedUser.totalTasksDone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. DELETE TASK ---
exports.deleteTask = async (req, res) => {
  try {
    // Gunakan findOneAndDelete agar lebih ringkas
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Quest tidak ditemukan" });
    }

    res.json({ success: true, message: "Quest dihapus dari sejarah" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};