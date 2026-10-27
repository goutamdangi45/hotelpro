const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');

// Helper to calculate nights between two dates
const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

// @desc    Create new booking reservation
// @route   POST /api/bookings
// @access  Private (Guest / Staff / Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      paymentMethod,
      specialRequests,
      cardLast4,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roomId, checkInDate, and checkOutDate',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This room is currently under maintenance and cannot be booked',
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date',
      });
    }

    // Verify room availability for requested dates
    const existingBooking = await Booking.findOne({
      room: roomId,
      bookingStatus: { $in: ['Confirmed', 'Checked-In', 'Pending'] },
      $or: [{ checkInDate: { $lt: end }, checkOutDate: { $gt: start } }],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This room is already reserved for the selected dates. Please choose different dates or another room.',
      });
    }

    const totalNights = calculateNights(checkInDate, checkOutDate);
    const baseAmount = room.pricePerNight * totalNights;
    const taxAmount = Math.round(baseAmount * 0.12 * 100) / 100; // 12% standard hospitality tax
    const serviceCharge = 25; // standard concierge / service fee
    const totalAmount = Math.round((baseAmount + taxAmount + serviceCharge) * 100) / 100;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `HP-${new Date().getFullYear()}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingNumber,
      user: req.user._id,
      room: room._id,
      checkInDate: start,
      checkOutDate: end,
      totalNights,
      guests: guests || { adults: 1, children: 0 },
      roomPrice: room.pricePerNight,
      baseAmount,
      taxAmount,
      serviceCharge,
      totalAmount,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Credit Card',
      specialRequests: specialRequests || '',
    });

    // Create payment transaction log
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${randomSuffix}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const payment = await Payment.create({
      transactionId,
      invoiceNumber,
      booking: booking._id,
      user: req.user._id,
      amount: totalAmount,
      currency: 'USD',
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Success',
      cardLast4: cardLast4 || '4242',
      notes: `Settled room reservation for room ${room.roomNumber} (${totalNights} nights)`,
    });

    // Populate booking with room details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      booking: populatedBooking,
      payment,
      message: 'Reservation created and confirmed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email phone avatar idProofType idProofNumber address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure guests only view their own bookings, staff/admin can view any
    if (
      req.user.role === 'guest' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    // Retrieve associated payment if exists
    const payment = await Payment.findOne({ booking: booking._id });

    res.status(200).json({
      success: true,
      booking,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin / Staff)
// @route   GET /api/bookings
// @access  Private (Staff / Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, date } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(targetDate.getDate() + 1);
      query.checkInDate = { $gte: targetDate, $lt: nextDay };
    }

    let bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // Filter by search query on guest name or booking number
    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(s) ||
          (b.user && b.user.name && b.user.name.toLowerCase().includes(s)) ||
          (b.room && b.room.roomNumber && b.room.roomNumber.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Check-in, Check-out, Key card issue)
// @route   PUT /api/bookings/:id/status
// @access  Private (Staff / Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, keyCardIssued, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus) {
      booking.bookingStatus = bookingStatus;
      if (bookingStatus === 'Checked-In') {
        booking.checkedInAt = new Date();
        // Update room status to Occupied
        await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });
      } else if (bookingStatus === 'Checked-Out') {
        booking.checkedOutAt = new Date();
        // Update room status to Cleaning
        await Room.findByIdAndUpdate(booking.room, {
          status: 'Available',
          cleanlinessStatus: 'Dirty',
        });
      }
    }

    if (typeof keyCardIssued === 'boolean') {
      booking.keyCardIssued = keyCardIssued;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      booking: updatedBooking,
      message: 'Booking status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Guest / Staff / Admin)
exports.cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Permission check
    if (
      req.user.role === 'guest' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.bookingStatus === 'Checked-In' || booking.bookingStatus === 'Checked-Out') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that has already ${booking.bookingStatus}`,
      });
    }

    booking.bookingStatus = 'Cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by user request';
    booking.cancelledAt = new Date();
    booking.paymentStatus = 'Refunded';
    await booking.save();

    // Update associated payment to Refunded
    await Payment.updateMany(
      { booking: booking._id },
      { status: 'Refunded', notes: 'Reservation cancelled - amount refunded' }
    );

    // Free room status if it was reserved
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });

    res.status(200).json({
      success: true,
      booking,
      message: 'Booking cancelled successfully and refund processed',
    });
  } catch (error) {
    next(error);
  }
};
