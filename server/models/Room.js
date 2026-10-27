const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide room title / name'],
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please select a room type'],
      enum: ['Single', 'Double', 'Deluxe', 'Executive Suite', 'Presidential Suite', 'Family Suite'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
      min: [1, 'Price per night must be at least 1'],
    },
    capacity: {
      adults: {
        type: Number,
        required: true,
        default: 2,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    bedType: {
      type: String,
      default: 'King Size',
    },
    floor: {
      type: Number,
      default: 1,
    },
    sizeSqFt: {
      type: Number,
      default: 350,
    },
    amenities: {
      type: [String],
      default: [
        'High-Speed Wi-Fi',
        'Smart TV',
        'Air Conditioning',
        'Mini Fridge',
        'Room Service',
      ],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Occupied', 'Maintenance', 'Cleaning'],
      default: 'Available',
    },
    cleanlinessStatus: {
      type: String,
      enum: ['Clean', 'Dirty', 'Inspecting', 'Sanitizing'],
      default: 'Clean',
    },
    description: {
      type: String,
      default: 'Spacious and elegantly furnished guest room designed with luxury comfort and modern hospitality in mind.',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
