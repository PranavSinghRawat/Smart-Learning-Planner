const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('👉 Check: 1) Atlas IP whitelist  2) MONGO_URI in .env  3) Network access');
    process.exit(1);
  }
};

module.exports = connectDB;
