const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Maintenance = require('./models/Maintenance');
const { sampleUsers, sampleRooms } = require('./data/sampleData');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to root .env if present

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Maintenance.deleteMany();

    console.log('Seeding Users...');
    // Use User.create so bcrypt password middleware hashes them
    const createdUsers = [];
    for (const u of sampleUsers) {
      const userDoc = await User.create(u);
      createdUsers.push(userDoc);
    }

    console.log('Seeding Rooms...');
    const createdRooms = await Room.insertMany(sampleRooms);

    const admin = createdUsers.find((u) => u.role === 'admin');
    const staff = createdUsers.find((u) => u.role === 'staff');
    const guest1 = createdUsers.find((u) => u.email === 'guest@hotelpro.com');
    const guest2 = createdUsers.find((u) => u.email === 'david.kim@example.com');

    console.log('Seeding Initial Bookings & Payments...');
    // Create a confirmed booking for Guest 1 in Room 101
    const checkIn1 = new Date();
    checkIn1.setDate(checkIn1.getDate() + 2);
    const checkOut1 = new Date();
    checkOut1.setDate(checkOut1.getDate() + 5);

    const booking1 = await Booking.create({
      bookingNumber: 'HP-2026-8812',
      user: guest1._id,
      room: createdRooms[0]._id,
      checkInDate: checkIn1,
      checkOutDate: checkOut1,
      totalNights: 3,
      guests: { adults: 2, children: 1 },
      roomPrice: createdRooms[0].pricePerNight,
      baseAmount: createdRooms[0].pricePerNight * 3,
      taxAmount: Math.round(createdRooms[0].pricePerNight * 3 * 0.12 * 100) / 100,
      serviceCharge: 25,
      totalAmount: Math.round((createdRooms[0].pricePerNight * 3 * 1.12 + 25) * 100) / 100,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      specialRequests: 'High floor preferred, late check-in at 8:00 PM',
    });

    await Payment.create({
      transactionId: 'TXN-HP-2026-9001',
      invoiceNumber: 'INV-2026-00192',
      booking: booking1._id,
      user: guest1._id,
      amount: booking1.totalAmount,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'Success',
      cardLast4: '4242',
      notes: 'Initial deposit & full room booking payment settled',
    });

    // Create a checked-in active booking for Guest 2 in Room 102
    const checkIn2 = new Date();
    checkIn2.setDate(checkIn2.getDate() - 1);
    const checkOut2 = new Date();
    checkOut2.setDate(checkOut2.getDate() + 2);

    const booking2 = await Booking.create({
      bookingNumber: 'HP-2026-8815',
      user: guest2._id,
      room: createdRooms[1]._id,
      checkInDate: checkIn2,
      checkOutDate: checkOut2,
      totalNights: 3,
      guests: { adults: 2, children: 0 },
      roomPrice: createdRooms[1].pricePerNight,
      baseAmount: createdRooms[1].pricePerNight * 3,
      taxAmount: Math.round(createdRooms[1].pricePerNight * 3 * 0.12 * 100) / 100,
      serviceCharge: 25,
      totalAmount: Math.round((createdRooms[1].pricePerNight * 3 * 1.12 + 25) * 100) / 100,
      bookingStatus: 'Checked-In',
      checkedInAt: checkIn2,
      keyCardIssued: true,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      specialRequests: 'Champagne on arrival & extra goose-down pillows',
    });

    // Update Room 102 status to Occupied
    await Room.findByIdAndUpdate(createdRooms[1]._id, { status: 'Occupied' });

    await Payment.create({
      transactionId: 'TXN-HP-2026-9002',
      invoiceNumber: 'INV-2026-00193',
      booking: booking2._id,
      user: guest2._id,
      amount: booking2.totalAmount,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'Success',
      cardLast4: '8819',
      notes: 'VIP Executive suite package payment completed',
    });

    console.log('Seeding Housekeeping Tasks...');
    await Maintenance.create({
      room: createdRooms[2]._id,
      taskType: 'Deep Cleaning',
      priority: 'High',
      status: 'Pending',
      assignedStaff: 'Housekeeping Team Beta',
      reportedBy: staff._id,
      description: 'Pre-arrival VIP inspection and deep linen sanitization',
      notes: 'Check mini-bar restock and ocean balcony glass polish',
    });

    await Maintenance.create({
      room: createdRooms[4]._id,
      taskType: 'Inspection',
      priority: 'Medium',
      status: 'In Progress',
      assignedStaff: 'Alex Carter',
      reportedBy: admin._id,
      description: 'Routine air conditioning filter inspection and smart lock calibration',
      notes: 'Checked airflow - normal condition',
    });

    console.log('====================================================');
    console.log('✓ HotelPro Database successfully seeded!');
    console.log('----------------------------------------------------');
    console.log('Default Credentials:');
    console.log('👑 Admin: admin@hotelpro.com / password123');
    console.log('🛎 Staff: staff@hotelpro.com / password123');
    console.log('🧳 Guest: guest@hotelpro.com / password123');
    console.log('====================================================');
    process.exit();
  } catch (error) {
    console.error(`✗ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Maintenance.deleteMany();
    console.log('✓ HotelPro Database cleared!');
    process.exit();
  } catch (error) {
    console.error(`✗ Clearing Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
