const mongoose = require("mongoose");
const Application = require("../models/application");
const Scheme = require("../models/scheme");
const User = require("../models/user");
const { evaluateScheme } = require("../services/ruleEngine");
const { normalizeProfile } = require("../services/recommendationEngine");

/**
 * POST /api/applications
 *
 * Prototype-scope application creation. There is no authentication in
 * this project, so the caller identifies the applicant with a plain
 * `applicantName` string instead of a logged-in user/session.
 *
 * Because Application.user is a required reference to the User model
 * (owned by the database layer, not modified here), a minimal User
 * document is created behind the scenes from `applicantName` so the
 * existing schema's validation is satisfied. This is NOT an auth system —
 * the caller never receives or manages a user id; it's purely internal
 * bookkeeping to keep the existing Application schema intact.
 *
 * Request body:
 * {
 *   "applicantName": "Asha Devi",
 *   "schemeId": "mahila",              // Scheme.schemeId or Mongo _id
 *   "answers": {                        // same shape as /api/recommendations input
 *     "age": 27, "gender": "female", "income": 180000,
 *     "category": "yes", "purpose": "business_new", "cost": 140000, "location": "Delhi"
 *   }
 * }
 */
const createApplication = async (req, res, next) => {
  try {
    const { applicantName, schemeId, answers } = req.body;

    // ---- Basic validation ----
    const errors = [];

    if (
      !applicantName ||
      typeof applicantName !== "string" ||
      !applicantName.trim()
    ) {
      errors.push("'applicantName' is required and must be a non-empty string.");
    }

    if (!schemeId || typeof schemeId !== "string") {
      errors.push("'schemeId' is required and must be a string.");
    }

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      errors.push("'answers' is required and must be an object.");
    }

    if (errors.length > 0) {
      const error = new Error(errors.join(" "));
      error.statusCode = 400;
      return next(error);
    }

    // ---- Resolve the scheme (by schemeId or Mongo _id) ----
    let scheme = null;
    if (mongoose.Types.ObjectId.isValid(schemeId)) {
      scheme = await Scheme.findById(schemeId);
    }
    if (!scheme) {
      scheme = await Scheme.findOne({ schemeId: schemeId.toLowerCase() });
    }

    if (!scheme) {
      const error = new Error(`Scheme not found for id: ${schemeId}`);
      error.statusCode = 404;
      return next(error);
    }

    // ---- Evaluate eligibility using the existing rule engine ----
    const profile = normalizeProfile(answers);
    const result = evaluateScheme(scheme, profile);

    // ---- Minimal applicant record (no auth) ----
    // Satisfies the existing Application.user required reference without
    // introducing login/session logic. Uses a generated placeholder email
    // since User.email is required + unique in the existing schema.
    const placeholderEmail = `${applicantName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ".")}.${Date.now()}@applicant.schemesetu.local`;

    const user = await User.create({
      name: applicantName.trim(),
      email: placeholderEmail,
      role: "applicant",
      profile: answers,
    });

    // ---- Create the application ----
    const application = await Application.create({
      user: user._id,
      scheme: scheme._id,
      schemeVersion: scheme.version,
      answers,
      evaluation: {
        eligible: result.eligible,
        score: result.score,
        failedHardRules: result.failedHardRules.map((r) => r.field),
        explanations: result.evaluatedRules.map((r) => r.explanation),
      },
      status: "submitted",
    });

    res.status(201).json({
      success: true,
      data: {
        applicationId: application._id,
        applicantName: user.name,
        schemeId: scheme.schemeId,
        schemeName: scheme.name,
        status: application.status,
        eligible: application.evaluation.eligible,
        matchScore: application.evaluation.score,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:id
 * Returns a single application by its Mongo _id, with scheme + applicant
 * details populated for display.
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`Invalid application id: ${id}`);
      error.statusCode = 400;
      return next(error);
    }

    const application = await Application.findById(id)
      .populate("user", "name email")
      .populate("scheme", "schemeId name interestRate maxLoanAmount");

    if (!application) {
      const error = new Error(`Application not found for id: ${id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications
 * Lists applications. Prototype scope: no pagination, optional
 * ?schemeId=micro filter to narrow results for a demo.
 */
const getApplications = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.schemeId) {
      const scheme = await Scheme.findOne({
        schemeId: req.query.schemeId.toLowerCase(),
      });
      if (scheme) {
        filter.scheme = scheme._id;
      } else {
        // No matching scheme -> return an empty result set, not an error
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
    }

    const applications = await Application.find(filter)
      .populate("user", "name email")
      .populate("scheme", "schemeId name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createApplication, getApplicationById, getApplications };