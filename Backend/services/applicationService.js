const mongoose = require("mongoose");
const Application = require("../models/application");
const Scheme = require("../models/scheme");
const { evaluateScheme } = require("./ruleEngine");
const { normalizeProfile } = require("./recommendationEngine");

const resolveScheme = async (schemeId) => {
  if (!schemeId || typeof schemeId !== "string") {
    const error = new Error("'schemeId' is required and must be a string.");
    error.statusCode = 400;
    throw error;
  }

  let scheme = null;

  if (mongoose.Types.ObjectId.isValid(schemeId)) {
    scheme = await Scheme.findById(schemeId);
  }

  if (!scheme) {
    scheme = await Scheme.findOne({
      schemeId: schemeId.toLowerCase(),
    });
  }

  if (!scheme) {
    const error = new Error(`Scheme not found for id: ${schemeId}`);
    error.statusCode = 404;
    throw error;
  }

  if (!scheme.active) {
    const error = new Error("This scheme is currently inactive.");
    error.statusCode = 409;
    throw error;
  }

  return scheme;
};

const buildApplicationDocuments = (scheme) => {
  return (scheme.requiredDocuments || []).map((document, index) => ({
    requirementId: `scheme-doc-${index + 1}`,
    name: document,
    mandatory: true,
    status: "pending",
  }));
};

const createDraftApplication = async ({
  userId,
  schemeId,
  answers,
}) => {
  if (!userId) {
    const error = new Error("Authenticated user is required.");
    error.statusCode = 401;
    throw error;
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    const error = new Error("'answers' is required and must be an object.");
    error.statusCode = 400;
    throw error;
  }

  const scheme = await resolveScheme(schemeId);

  /*
   * Re-evaluate eligibility on the backend.
   * Never trust a score or eligibility value sent by the browser.
   */
  const profile = normalizeProfile(answers);
  const result = evaluateScheme(scheme, profile);

  if (!result.eligible) {
    const error = new Error(
      "Applicant does not currently satisfy the eligibility criteria for this scheme."
    );

    error.statusCode = 422;
    error.details = {
      eligible: false,
      score: result.score,
      failedHardRules: result.failedHardRules,
    };

    throw error;
  }

  const documents = buildApplicationDocuments(scheme);

  const initialStatus =
    documents.length > 0
      ? "documents_pending"
      : "eligibility_confirmed";

  const application = await Application.create({
    user: userId,
    scheme: scheme._id,
    schemeVersion: scheme.version,

    answers,

    evaluation: {
      eligible: result.eligible,
      score: result.score,
      failedHardRules: result.failedHardRules.map(
        (rule) => rule.field
      ),
      explanations: result.evaluatedRules.map(
        (rule) => rule.explanation
      ),
      evaluatedAt: new Date(),
    },

    status: initialStatus,

    statusHistory: [
      {
        status: initialStatus,
        note:
          initialStatus === "documents_pending"
            ? "Eligibility confirmed. Required documents are pending."
            : "Eligibility confirmed.",
        changedBy: userId,
        changedAt: new Date(),
      },
    ],

    documents,

    submission: {
      mode: scheme.officialPortalUrl
        ? "external_portal"
        : null,
      officialPortalUrl: scheme.officialPortalUrl || null,
    },
  });

  return application;
};

module.exports = {
  resolveScheme,
  createDraftApplication,
};