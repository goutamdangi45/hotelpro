const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getFeaturedRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllRooms);
router.get('/featured', getFeaturedRooms);
router.get('/:id', getRoomById);

// Staff and Admin routes
router.post('/', protect, authorize('admin', 'staff'), createRoom);
router.put('/:id', protect, authorize('admin', 'staff'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;
