const mongoose = require("mongoose");

/**
 * Partner Schema
 * Represents an authorised channelising agency / finance corporation /
 * cooperative branch etc. that disburses loans under one or more schemes.
 */
const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Partner name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    location: {
      // GeoJSON Point: [longitude, latitude]
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: [true, "Coordinates are required"],
        validate: {
          validator: (coords) => Array.isArray(coords) && coords.length === 2,
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    schemes: {
      // References to Scheme.schemeId values this partner services
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Partner must service at least one scheme",
      },
    },
    verifiedOn: {
      type: Date,
      required: [true, "Verification date is required"],
    },
  },
  { timestamps: true }
);

partnerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Partner", partnerSchema);