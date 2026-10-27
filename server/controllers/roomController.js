const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with dynamic filtering, search & availability check
// @route   GET /api/rooms
// @access  Public
exports.getAllRooms = async (req, res, next) => {
  try {
    const {
      roomType,
      status,
      minPrice,
      maxPrice,
      adults,
      children,
      search,
      sort,
      checkIn,
      checkOut,
    } = req.query;

    let query = {};

    // Filter by roomType
    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Filter by capacity
    if (adults) {
      query['capacity.adults'] = { $gte: Number(adults) };
    }
    if (children) {
      query['capacity.children'] = { $gte: Number(children) };
    }

    // Search keyword
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { amenities: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Check availability if checkIn & checkOut dates provided
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      // Find all bookings that overlap with requested dates and are not cancelled
      const overlappingBookings = await Booking.find({
        bookingStatus: { $in: ['Confirmed', 'Checked-In', 'Pending'] },
        $or: [
          { checkInDate: { $lt: end }, checkOutDate: { $gt: start } },
        ],
      }).select('room');

      const bookedRoomIds = overlappingBookings.map((b) => b.room);
      query._id = { $nin: bookedRoomIds };
    }

    // Sorting
    let sortBy = { createdAt: -1 };
    if (sort === 'price-asc') sortBy = { pricePerNight: 1 };
    if (sort === 'price-desc') sortBy = { pricePerNight: -1 };
    if (sort === 'rating') sortBy = { rating: -1 };
    if (sort === 'roomNumber') sortBy = { roomNumber: 1 };

    const rooms = await Room.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured rooms for landing showcase
// @route   GET /api/rooms/featured
// @access  Public
exports.getFeaturedRooms = async (req, res, next) => {
  try {
    const featured = await Room.find({ featured: true }).limit(6);
    // If fewer than 3 featured, take top rated
    if (featured.length < 3) {
      const topRooms = await Room.find().sort({ rating: -1 }).limit(6);
      return res.status(200).json({ success: true, rooms: topRooms });
    }
    res.status(200).json({ success: true, rooms: featured });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room details
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin / Staff)
exports.createRoom = async (req, res, next) => {
  try {
    const existing = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room Number ${req.body.roomNumber} already exists in inventory`,
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      room,
      message: 'New room created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details or status
// @route   PUT /api/rooms/:id
// @access  Private (Admin / Staff)
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      room,
      message: 'Room updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room from inventory
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room has active bookings
    const activeBooking = await Booking.findOne({
      room: req.params.id,
      bookingStatus: { $in: ['Confirmed', 'Checked-In'] },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active or confirmed bookings',
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room successfully removed from inventory',
    });
  } catch (error) {
    next(error);
  }
};
