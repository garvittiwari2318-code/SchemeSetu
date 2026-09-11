/**
 * Rule Engine
 *
 * Deterministic, auditable evaluator for Scheme.rules documents.
 * This module contains NO scheme-specific logic and NO hardcoded
 * eligibility criteria — every rule it evaluates comes from MongoDB
 * (a Scheme document's `rules` array). Adding, editing, or removing a
 * scheme's rules in the database changes behavior automatically; this
 * file never needs to change for that.
 *
 * No LLM / AI model is used anywhere in this file. All comparisons are
 * plain, explainable JavaScript operators.
 */

const SUPPORTED_OPERATORS = ["=", "!=", "<", "<=", ">", ">=", "in", "between"];

/**
 * Evaluate a single rule's operator/value against an actual applicant value.
 * Returns a boolean. Throws if the operator is unsupported (defensive —
 * the Mongoose schema already restricts this at write time).
 */
function evaluateOperator(operator, actual, expected) {
  switch (operator) {
    case "=":
      // Loose-ish equality that still respects type for booleans/strings/numbers.
      return actual === expected;

    case "!=":
      return actual !== expected;

    case "<":
      return typeof actual === "number" && actual < expected;

    case "<=":
      return typeof actual === "number" && actual <= expected;

    case ">":
      return typeof actual === "number" && actual > expected;

    case ">=":
      return typeof actual === "number" && actual >= expected;

    case "in":
      return Array.isArray(expected) && expected.includes(actual);

    case "between": {
      if (!Array.isArray(expected) || expected.length !== 2) return false;
      const [min, max] = expected;
      return typeof actual === "number" && actual >= min && actual <= max;
    }

    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

/**
 * Formats a human-readable "expected condition" string for audit output,
 * e.g. "familyIncome <= 300000" or "age between [18, 55]".
 */
function formatCondition(field, operator, value) {
  if (operator === "between" && Array.isArray(value)) {
    return `${field} between [${value[0]}, ${value[1]}]`;
  }
  if (operator === "in" && Array.isArray(value)) {
    return `${field} in [${value.join(", ")}]`;
  }
  return `${field} ${operator} ${JSON.stringify(value)}`;
}

/**
 * Evaluates ONE rule against ONE applicant profile.
 *
 * @param {Object} rule - a single rule sub-document { field, operator, value, hard, weight, explanation }
 * @param {Object} profile - normalized applicant profile, e.g. { familyIncome: 220000, age: 27, ... }
 * @returns {Object} evaluation result for this rule
 */
function evaluateRule(rule, profile) {
  const { field, operator, value, hard, weight, explanation } = rule;

  if (!SUPPORTED_OPERATORS.includes(operator)) {
    throw new Error(`Unsupported operator encountered in rule: ${operator}`);
  }

  const actual = profile[field];
  const passed =
    typeof actual === "undefined"
      ? false // missing profile field can never satisfy a rule
      : evaluateOperator(operator, actual, value);

  return {
    field,
    operator,
    expectedCondition: formatCondition(field, operator, value),
    actualValue: typeof actual === "undefined" ? null : actual,
    hard,
    weight: hard ? 0 : weight,
    passed,
    explanation,
  };
}

/**
 * Evaluates ALL rules of a scheme against an applicant profile.
 *
 * @param {Object} scheme - a Scheme document (or plain object) with `.rules` and `.scoring`
 * @param {Object} profile - normalized applicant profile
 * @returns {Object} {
 *   eligible: boolean,               // true only if every hard rule passed
 *   score: number,                   // 0-100 weighted fit score
 *   evaluatedRules: [...],           // every rule evaluated, with pass/fail + explanation
 *   passedRules: [...],              // subset that passed
 *   failedRules: [...],              // subset that failed
 *   failedHardRules: [...],          // subset of failedRules that are hard (why ineligible)
 * }
 */
function evaluateScheme(scheme, profile) {
  const rules = Array.isArray(scheme.rules) ? scheme.rules : [];

  const evaluatedRules = rules.map((rule) => evaluateRule(rule, profile));

  const hardRules = evaluatedRules.filter((r) => r.hard);
  const softRules = evaluatedRules.filter((r) => !r.hard);

  const eligible = hardRules.every((r) => r.passed);

  // ---- Weighted fit score ----
  // baseScore + sum of weights for PASSED soft rules, clamped to [min, max].
  // baseScore/min/max come from the scheme document itself (MongoDB),
  // never hardcoded here.
  const scoring = scheme.scoring || { baseScore: 0, min: 0, max: 100 };
  const earnedWeight = softRules
    .filter((r) => r.passed)
    .reduce((sum, r) => sum + (r.weight || 0), 0);

  let score = scoring.baseScore + earnedWeight;
  score = Math.max(scoring.min, Math.min(scoring.max, score));

  // Ineligible schemes are still scored (useful for "how close were they"
  // context) but callers should treat eligible:false as the authoritative
  // signal, not the score.

  const passedRules = evaluatedRules.filter((r) => r.passed);
  const failedRules = evaluatedRules.filter((r) => !r.passed);
  const failedHardRules = failedRules.filter((r) => r.hard);

  return {
    eligible,
    score: Math.round(score),
    evaluatedRules,
    passedRules,
    failedRules,
    failedHardRules,
  };
}

module.exports = {
  SUPPORTED_OPERATORS,
  evaluateOperator,
  evaluateRule,
  evaluateScheme,
};