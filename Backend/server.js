
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ----------------------------------------------------------------------
// DATABASE LAYER (owned by the database/MongoDB teammate)
// config/db.js, models/, and seed/ belong to that layer. This backend
// only consumes the connection via connectDB() below — nothing here
// should assume knowledge of schema internals beyond the Mongoose
// models already exposed for use by controllers/services.
// ----------------------------------------------------------------------
const connectDB = require("./config/db");
connectDB();
// ----------------------------------------------------------------------

const { notFound, errorHandler } = require("./middleware/errorHandler");

// ----------------------------------------------------------------------
// APPLICATION LAYER (this backend's responsibility)
// Routes -> Controllers -> Services (rule engine / recommendation engine).
// These consume the Mongoose models exposed by the database layer above
// but contain all of this project's own REST + business logic.
// ----------------------------------------------------------------------
const healthRoutes = require("./routes/healthRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const partnerRoutes = require("./routes/Partnerroutes");
const applicationRoutes = require("./routes/Applicationroutes");

const app = express();

// ---- Global Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the SchemeSetu API (SIH26092)",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/applications", applicationRoutes);

// Future route mounts (uncomment as features are built):
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/users", require("./routes/userRoutes"));

// ---- Error Handling Middleware (must be last) ----
app.use(notFound);
app.use(errorHandler);

// ---- Start Server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;