const mongoose = require("mongoose");

/**
 * User Schema
 * Minimal foundation for applicants/officers. Authentication (password
 * hashing, JWT issuing, etc.) is intentionally NOT implemented yet —
 * this is just the data shape.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false, // never returned by default queries
    },
    role: {
      type: String,
      enum: ["applicant", "officer", "admin"],
      default: "applicant",
    },
    // Applicant profile fields used by the eligibility rule engine.
    // Kept generic/flat so new rule fields can be added without a schema change.
    profile: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);