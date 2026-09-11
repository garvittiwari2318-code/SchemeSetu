/**
 * Recommendation Engine
 *
 * Orchestrates the eligibility + scoring pipeline:
 *   1. Load ACTIVE schemes from MongoDB (never hardcoded).
 *   2. Normalize the applicant's raw request body into the field names
 *      used by Scheme.rules (e.g. "income" -> "familyIncome").
 *   3. Run each scheme's rules through the generic rule engine.
 *   4. Rank schemes by match score (eligible schemes first, highest score first).
 *
 * No LLM / AI model is used. Every decision is a deterministic rule
 * comparison sourced from MongoDB documents.
 */

const Scheme = require("../models/scheme");
const { evaluateScheme } = require("./ruleEngine");

/**
 * Maps the public-facing applicant request body (as specified in the API
 * contract) to the internal profile field names used inside Scheme.rules
 * documents. This mapping is the ONLY place that knows about both naming
 * conventions — the rule engine itself stays fully generic.
 *
 * Public field   -> Internal rule field(s)
 * ------------------------------------------------------------------
 * age            -> age                          (pass-through)
 * gender         -> gender                        (pass-through, lowercased)
 * income         -> familyIncome                  (renamed)
 * category       -> targetCategory                ("yes"/"no" -> boolean)
 * purpose        -> purpose                        (normalized to the
 *                                                    "starting_business" /
 *                                                    "expanding_business" /
 *                                                    "education" vocabulary
 *                                                    used by seeded rules)
 * cost           -> projectCost AND courseCost     (same number applied to
 *                                                    both possible cost
 *                                                    fields, since a given
 *                                                    scheme's rules only
 *                                                    ever reference ONE of
 *                                                    them — the other is
 *                                                    simply unused for that
 *                                                    scheme's evaluation)
 * location       -> location                       (pass-through, kept for
 *                                                    future partner-matching
 *                                                    use; no seeded rule
 *                                                    currently references it)
 */
function normalizeProfile(input) {
  const profile = {};

  if (typeof input.age !== "undefined") {
    profile.age = Number(input.age);
  }

  if (typeof input.gender !== "undefined") {
    profile.gender = String(input.gender).toLowerCase().trim();
  }

  if (typeof input.income !== "undefined") {
    profile.familyIncome = Number(input.income);
  }

  if (typeof input.category !== "undefined") {
    const rawCategory = String(input.category).toLowerCase().trim();
    profile.targetCategory = rawCategory === "yes" || rawCategory === "true";
  }

  if (typeof input.purpose !== "undefined") {
    profile.purpose = normalizePurpose(input.purpose);
  }

  if (typeof input.cost !== "undefined") {
    const numericCost = Number(input.cost);
    profile.projectCost = numericCost;
    profile.courseCost = numericCost;
  }

  if (typeof input.location !== "undefined") {
    profile.location = String(input.location).trim();
  }

  return profile;
}

/**
 * Normalizes free-form/varied "purpose" input values into the fixed
 * vocabulary used by the seeded scheme rules:
 *   "starting_business", "expanding_business", "education"
 *
 * Accepts common variants (e.g. "business_new", "new_business",
 * "business_expansion", "edu", "education") so the public API isn't
 * forced to match internal rule vocabulary exactly.
 */
function normalizePurpose(rawPurpose) {
  const p = String(rawPurpose).toLowerCase().trim();

  const startingBusinessAliases = [
    "business_new",
    "new_business",
    "starting_business",
    "start_business",
    "new",
  ];
  const expandingBusinessAliases = [
    "business_expansion",
    "expand_business",
    "expanding_business",
    "business_expand",
    "expansion",
  ];
  const educationAliases = ["education", "edu", "course_fees", "course"];

  if (startingBusinessAliases.includes(p)) return "starting_business";
  if (expandingBusinessAliases.includes(p)) return "expanding_business";
  if (educationAliases.includes(p)) return "education";

  // Unknown/unmapped purpose values are passed through as-is; rules that
  // check purpose will simply fail to match, which is the correct
  // deterministic behavior rather than silently guessing.
  return p;
}

/**
 * Loads all active schemes and evaluates the given raw applicant input
 * against each one, returning a ranked recommendation list.
 *
 * @param {Object} rawInput - the applicant request body as received by the API
 * @returns {Promise<Array>} ranked array of recommendation objects
 */
async function getRecommendations(rawInput) {
  const profile = normalizeProfile(rawInput);

  const activeSchemes = await Scheme.find({ active: true }).lean();

  const recommendations = activeSchemes.map((scheme) => {
    const result = evaluateScheme(scheme, profile);

    return {
      schemeId: scheme.schemeId,
      name: scheme.name,
      eligible: result.eligible,
      matchScore: result.score,
      passedRules: result.passedRules,
      failedRules: result.failedRules,
      ruleExplanations: result.evaluatedRules.map((r) => ({
        field: r.field,
        expectedCondition: r.expectedCondition,
        actualValue: r.actualValue,
        passed: r.passed,
        hard: r.hard,
        explanation: r.explanation,
      })),
      interestRate: scheme.interestRate,
      maxLoanAmount: scheme.maxLoanAmount,
      maxTenureYears: scheme.maxTenureYears,
      moratoriumMonths: scheme.moratoriumMonths,
    };
  });

  // Rank: eligible schemes first (by descending score), then ineligible
  // schemes (also by descending score, so "closest matches" surface first).
  recommendations.sort((a, b) => {
    if (a.eligible !== b.eligible) {
      return a.eligible ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  return recommendations;
}

module.exports = { getRecommendations, normalizeProfile, normalizePurpose };