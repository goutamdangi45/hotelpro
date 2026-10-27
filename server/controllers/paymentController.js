const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin / Staff)
exports.getAllPayments = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    let payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .populate({
        path: 'booking',
        populate: { path: 'room', select: 'roomNumber title roomType pricePerNight' },
      })
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(s) ||
          p.invoiceNumber.toLowerCase().includes(s) ||
          (p.user && p.user.name && p.user.name.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment / invoice details
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email phone address idProofType idProofNumber')
      .populate({
        path: 'booking',
        populate: { path: 'room' },
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment invoice not found',
      });
    }

    // Authorization: User can only see their own, staff/admin can see any
    if (
      req.user.role === 'guest' &&
      payment.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this invoice',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private (Admin only)
exports.processRefund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status === 'Refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already refunded',
      });
    }

    payment.status = 'Refunded';
    payment.notes = req.body.notes || 'Refund processed by hotel administrator';
    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: 'Refunded',
    });

    res.status(200).json({
      success: true,
      payment,
      message: 'Payment successfully refunded',
    });
  } catch (error) {
    next(error);
  }
};
