const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'staff'), getAllTasks);
router.post('/', protect, authorize('admin', 'staff'), createTask);
router.put('/:id', protect, authorize('admin', 'staff'), updateTask);
router.delete('/:id', protect, authorize('admin'), deleteTask);

module.exports = router;
