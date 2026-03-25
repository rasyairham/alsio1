const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper function tetap di sini agar tidak merubah struktur controller
const sendNotification = async (userId, type, title, desc) => {
  try {
    await Notification.create({ user: userId, type, title, desc });
  } catch (err) {
    console.error("Internal Notification Error:", err);
  }
};

// --- 1. GET ALL TASKS (DENGAN PENALTY OTOMATIS) ---
exports.getAllTasks = async (req, res) => {
  try {
    const now = new Date();
    
    // Cari task yang sudah lewat deadline tapi belum kena pinalti
    const overdueTasks = await Task.find({
      user: req.user.id,
      status: "pending",
      deadline: { $lt: now }
    });

    if (overdueTasks.length > 0) {
      const penaltyAmount = overdueTasks.length * 50;

      // 1. Kurangi XP User
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: -penaltyAmount } });

      // 2. Tandai Task sebagai Failed agar tidak kena pinalti berulang kali
      await Task.updateMany(
        { _id: { $in: overdueTasks.map(t => t._id) } },
        { $set: { status: "failed" } }
      );

      // 3. Simpan ke database notifikasi
      await sendNotification(
        req.user.id, 
        'alert', 
        'Mission Failed!', 
        `Operation failed. You lost ${penaltyAmount} XP because missions expired.`
      );
    }

    // Ambil data terbaru untuk dikirim ke frontend
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CREATE TASK ---
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, category, xp } = req.body;
    
    if (!title || !deadline) {
      return res.status(400).json({ success: false, message: "Title and Deadline are required!" });
    }

    const newTask = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description || "",
      deadline: new Date(deadline),
      category: category || "General",
      xp: xp || 100,
      status: "pending"
    });

    const savedTask = await newTask.save();

    // KIRIM NOTIFIKASI
    await sendNotification(
      req.user.id, 
      'system', 
      'Mission Deployed', 
      `Mission "${title}" has been registered to your terminal.`
    );

    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- 3. COMPLETE TASK ---
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    if (task.status === "completed") return res.status(400).json({ success: false, message: "Already claimed!" });
    if (task.status === "failed") return res.status(400).json({ success: false, message: "Mission expired!" });

    // Update Status Task
    task.status = "completed";
    await task.save();

    // Update User Stats (XP & Total Done)
    const xpReward = Number(task.xp) || 100;
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xp: xpReward, totalTasksDone: 1 } }
    );

    // KIRIM NOTIFIKASI REWARD
    await sendNotification(
      req.user.id, 
      'reward', 
      'Quest Reward Claimed!', 
      `Excellent work! +${xpReward} XP secured for completing "${task.title}".`
    );

    res.status(200).json({ 
      success: true, 
      message: `Task completed! +${xpReward} XP`, 
      data: task 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. DELETE TASK ---
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedTask) return res.status(404).json({ success: false, message: "Task not found" });
    
    res.json({ success: true, message: "Data removed from logs" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};