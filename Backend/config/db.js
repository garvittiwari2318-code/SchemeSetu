const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI from environment variables.
 * Caches the connection across serverless invocations so we don't
 * open a new connection (or hit buffering timeouts) on every request.
 */
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // allow retry on next request
    throw new Error(`MongoDB connection error: ${error.message}`);
  }

  return cached.conn;
};

// Optional: log unexpected disconnects during runtime
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

module.exports = connectDB;