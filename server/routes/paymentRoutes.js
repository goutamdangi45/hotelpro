const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById,
  processRefund,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:id', protect, getPaymentById);
router.get('/', protect, authorize('admin', 'staff'), getAllPayments);
router.post('/:id/refund', protect, authorize('admin'), processRefund);

module.exports = router;
