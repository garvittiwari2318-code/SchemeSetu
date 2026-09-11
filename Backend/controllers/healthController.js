const mongoose = require("mongoose");

/**
 * GET /api/health
 * Basic health check endpoint - confirms the API is running
 * and reports current MongoDB connection status.
 */
const getHealth = (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "SchemeSetu API is up and running",
    timestamp: new Date().toISOString(),
    database: dbStates[mongoose.connection.readyState] || "unknown",
  });
};

module.exports = { getHealth };