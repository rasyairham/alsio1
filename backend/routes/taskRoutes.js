const express = require('express');
const router = express.Router();
// Pastikan path ../controllers/taskController sudah benar
const { 
  getAllTasks, 
  createTask, 
  completeTask, 
  deleteTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Route definitions
router.get('/', protect, getAllTasks); // Baris ini yang sebelumnya error karena getAllTasks undefined
router.post('/create', protect, createTask);
router.patch('/:id/complete', protect, completeTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;