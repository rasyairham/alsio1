const Task = require('../models/Task');
const User = require('../models/User');

// --- 1. GET ALL TASKS (DENGAN AUTO-PENALTY CHECK) ---
exports.getAllTasks = async (req, res) => {
  try {
    const now = new Date();
    
    // 1. Ambil semua task user yang belum selesai tapi sudah lewat deadline
    const overdueTasks = await Task.find({
      user: req.user.id,
      status: "pending",
      deadline: { $lt: now },
      penaltyApplied: { $ne: true } // Pastikan belum pernah kena penalti
    });

    // 2. Jika ada task yang telat, kurangi XP user
    if (overdueTasks.length > 0) {
      const penaltyAmount = overdueTasks.length * 50; // Penalti 50 XP per task
      
      // Update XP User (Gunakan $inc dengan nilai negatif)
      await User.findByIdAndUpdate(req.user.id, { 
        $inc: { xp: -penaltyAmount } 
      });

      // Tandai semua task tersebut agar tidak kena penalti lagi di refresh berikutnya
      await Task.updateMany(
        { _id: { $in: overdueTasks.map(t => t._id) } },
        { $set: { penaltyApplied: true, status: "failed" } }
      );
    }

    // 3. Ambil data terbaru untuk dikirim ke frontend
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
      xp: xp || 100,
      status: "pending",
      penaltyApplied: false // Inisialisasi field penalti
    });

    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. COMPLETE TASK ---
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ success: false, message: "Quest tidak ditemukan" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ success: false, message: "Quest ini sudah pernah diklaim!" });
    }

    // Tambahan: Jika statusnya failed (telat), tidak bisa dikomplitkan untuk dapat XP
    if (task.status === "failed") {
      return res.status(400).json({ success: false, message: "Quest sudah kadaluwarsa dan gagal!" });
    }

    task.status = "completed";
    await task.save();

    const xpReward = Number(task.xp) || 100;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xp: xpReward, totalTasksDone: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    res.status(200).json({ 
      success: true, 
      message: `Quest Clear! +${xpReward} XP`, 
      data: task,
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
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Quest tidak ditemukan" });
    }

    res.json({ success: true, message: "Quest dihapus dari sejarah" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};