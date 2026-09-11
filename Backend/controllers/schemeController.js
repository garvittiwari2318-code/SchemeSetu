const mongoose = require("mongoose");
const Scheme = require("../models/scheme");

/**
 * GET /api/schemes
 * Returns all schemes. Supports optional query params:
 *   ?active=true|false   -> filter by active status
 *
 * Errors are passed to the centralized error handler via next(err).
 */
const getSchemes = async (req, res, next) => {
  try {
    const filter = {};

    if (typeof req.query.active !== "undefined") {
      if (req.query.active !== "true" && req.query.active !== "false") {
        const error = new Error(
          "Query parameter 'active' must be either 'true' or 'false'."
        );
        error.statusCode = 400;
        return next(error);
      }
      filter.active = req.query.active === "true";
    }

    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/schemes/:id
 * Returns a single scheme by its Mongo _id OR by its human-readable
 * schemeId (e.g. "micro", "term", "mahila", "edu") — whichever matches.
 */
const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let scheme = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      scheme = await Scheme.findById(id);
    }

    // Fallback: allow lookup by the readable schemeId as well
    if (!scheme) {
      scheme = await Scheme.findOne({ schemeId: id.toLowerCase() });
    }

    if (!scheme) {
      const error = new Error(`Scheme not found for id: ${id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSchemes, getSchemeById };