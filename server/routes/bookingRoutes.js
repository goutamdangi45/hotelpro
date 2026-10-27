const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

// Staff and Admin routes
router.get('/', protect, authorize('admin', 'staff'), getAllBookings);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateBookingStatus);

module.exports = router;
