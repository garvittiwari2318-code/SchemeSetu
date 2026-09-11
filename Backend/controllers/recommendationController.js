const { getRecommendations } = require("../services/recommendationEngine");

const VALID_GENDERS = ["male", "female", "other"];
const VALID_CATEGORY_VALUES = ["yes", "no", "true", "false"];

/**
 * Validates the incoming applicant profile body.
 * Returns an array of error messages (empty array = valid).
 */
function validateRecommendationInput(body) {
  const errors = [];

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return ["Request body must be a JSON object."];
  }

  const { age, gender, income, category, purpose, cost, location } = body;

  if (typeof age === "undefined" || age === null || age === "") {
    errors.push("'age' is required.");
  } else if (typeof age !== "number" && isNaN(Number(age))) {
    errors.push("'age' must be a number.");
  } else if (Number(age) < 0 || Number(age) > 120) {
    errors.push("'age' must be a realistic value between 0 and 120.");
  }

  if (typeof gender === "undefined" || gender === null || gender === "") {
    errors.push("'gender' is required.");
  } else if (!VALID_GENDERS.includes(String(gender).toLowerCase().trim())) {
    errors.push(`'gender' must be one of: ${VALID_GENDERS.join(", ")}.`);
  }

  if (typeof income === "undefined" || income === null || income === "") {
    errors.push("'income' is required.");
  } else if (typeof income !== "number" && isNaN(Number(income))) {
    errors.push("'income' must be a number.");
  } else if (Number(income) < 0) {
    errors.push("'income' cannot be negative.");
  }

  if (typeof category === "undefined" || category === null || category === "") {
    errors.push("'category' is required.");
  } else if (
    !VALID_CATEGORY_VALUES.includes(String(category).toLowerCase().trim())
  ) {
    errors.push(`'category' must be one of: ${VALID_CATEGORY_VALUES.join(", ")}.`);
  }

  if (typeof purpose === "undefined" || purpose === null || purpose === "") {
    errors.push("'purpose' is required.");
  }

  if (typeof cost === "undefined" || cost === null || cost === "") {
    errors.push("'cost' is required.");
  } else if (typeof cost !== "number" && isNaN(Number(cost))) {
    errors.push("'cost' must be a number.");
  } else if (Number(cost) < 0) {
    errors.push("'cost' cannot be negative.");
  }

  if (typeof location === "undefined" || location === null || location === "") {
    errors.push("'location' is required.");
  }

  return errors;
}

/**
 * POST /api/recommendations
 * Accepts an applicant profile, evaluates it deterministically against
 * every active scheme's rules (loaded from MongoDB), and returns a ranked
 * list of eligible + ineligible schemes with full rule-by-rule explanations.
 */
const postRecommendations = async (req, res, next) => {
  try {
    const validationErrors = validateRecommendationInput(req.body);

    if (validationErrors.length > 0) {
      const error = new Error(validationErrors.join(" "));
      error.statusCode = 400;
      return next(error);
    }

    const recommendations = await getRecommendations(req.body);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { postRecommendations, validateRecommendationInput };