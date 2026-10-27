const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.log(`ℹ If you do not have local MongoDB running, you can:`);
    console.log(`  1. Start local MongoDB: mongod or 'net start MongoDB'`);
    console.log(`  2. Or provide a MongoDB Atlas cloud URI in server/.env (MONGO_URI=mongodb+srv://...)`);
  }
};

module.exports = connectDB;
