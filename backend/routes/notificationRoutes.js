const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware'); // Pastikan path ini benar sesuai folder kamu

// Semua route di bawah ini WAJIB login (pake token)
router.use(protect);

// Alamat: GET http://localhost:5000/api/notifications
router.get('/', getNotifications);

// Alamat: PUT http://localhost:5000/api/notifications/read-all
router.put('/read-all', markAsRead);

// Alamat: DELETE http://localhost:5000/api/notifications/:id
router.delete('/:id', deleteNotification);

module.exports = router;