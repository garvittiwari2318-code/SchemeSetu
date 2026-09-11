const mongoose = require("mongoose");
const Partner = require("../models/Partner");
const Scheme = require("../models/scheme");

/**
 * GET /api/partners?schemeId=micro
 * GET /api/partners?scheme=micro
 *
 * Returns partners authorised to service the given scheme.
 * `schemeId` is matched against Scheme.schemeId (e.g. "micro", "term").
 * Also accepts a Mongo _id for the scheme via the same query param.
 *
 * This is intentionally minimal: one read endpoint, no create/update/delete,
 * no pagination — matching the prototype's scope.
 */
const getPartnersForScheme = async (req, res, next) => {
  try {
    const schemeParam = req.query.schemeId || req.query.scheme;

    if (!schemeParam) {
      const error = new Error(
        "Query parameter 'schemeId' is required, e.g. /api/partners?schemeId=micro"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Resolve the human-readable schemeId (preferred) or a Mongo _id
    let resolvedSchemeId = schemeParam.toLowerCase();

    if (mongoose.Types.ObjectId.isValid(schemeParam)) {
      const scheme = await Scheme.findById(schemeParam);
      if (scheme) {
        resolvedSchemeId = scheme.schemeId;
      }
    }

    const partners = await Partner.find({ schemes: resolvedSchemeId }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPartnersForScheme };