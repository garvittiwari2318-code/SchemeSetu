const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process if the connection fails, since the app
 * cannot function without a database connection.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error.message}`);
  }
};

// Optional: log unexpected disconnects during runtime
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

module.exports = connectDB;