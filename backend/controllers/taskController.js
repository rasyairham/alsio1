const Task = require('../models/Task');
const User = require('../models/User');

// --- 1. GET ALL TASKS (WITH AUTO-PENALTY CHECK) ---
exports.getAllTasks = async (req, res) => {
  try {
    const now = new Date();
    
    // 1. Get all user's pending tasks that are overdue
    const overdueTasks = await Task.find({
      user: req.user.id,
      status: "pending",
      deadline: { $lt: now },
      penaltyApplied: { $ne: true } // Make sure penalty not applied yet
    });

    // 2. If there are overdue tasks, deduct user XP
    if (overdueTasks.length > 0) {
      const penaltyAmount = overdueTasks.length * 50; // 50 XP penalty per task
      
      // Update User XP (use $inc with negative value)
      await User.findByIdAndUpdate(req.user.id, { 
        $inc: { xp: -penaltyAmount } 
      });

      // Mark tasks so they won't be penalized again
      await Task.updateMany(
        { _id: { $in: overdueTasks.map(t => t._id) } },
        { $set: { penaltyApplied: true, status: "failed" } }
      );
    }

    // 3. Fetch updated tasks to return to frontend
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
      return res.status(400).json({ success: false, message: "Title and Deadline are required!" });
    }

    const newTask = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description || "",
      deadline: new Date(deadline),
      category: category || "General",
      xp: xp || 100,
      status: "pending",
      penaltyApplied: false // Initialize penalty field
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
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ success: false, message: "This task has already been completed!" });
    }

    // If task failed due to overdue, cannot complete for XP
    if (task.status === "failed") {
      return res.status(400).json({ success: false, message: "Task expired and failed!" });
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
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `Task completed! +${xpReward} XP`, 
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
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task removed from history" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};