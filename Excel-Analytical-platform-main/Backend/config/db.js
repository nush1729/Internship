const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // REASON: This uses the 'await' keyword to attempt a connection to the database.
    await mongoose.connect(process.env.MONGO_URI);
    // REASON: This will log to your backend console only on a successful connection.
    console.log('✅ MongoDB Connected Successfully...');
  } catch (error) {
    // REASON: If the connection fails (e.g., wrong password in .env), this will log a detailed error and stop the server.
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;