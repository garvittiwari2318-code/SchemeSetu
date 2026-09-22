const mongoose = require("mongoose");

const SUPPORTED_OPERATORS = ["=", "!=", "<", "<=", ">", ">=", "in", "between"];

/**
 * Rule Sub-Schema
 * Each rule describes ONE condition used either as a hard eligibility gate
 * or as a weighted scoring contributor (or both).
 *
 * field:       the applicant/application field this rule evaluates
 *              (e.g. "familyIncome", "projectCost", "age", "purpose", "gender")
 * operator:    comparison operator applied to `value`
 * value:       the comparison value. For "between" this MUST be an array of
 *              exactly two numbers [min, max]. For "in" this MUST be an array
 *              of allowed values. For all other operators this is a single
 *              value (Mixed type keeps it flexible for numbers/strings/bools).
 * hard:        if true, failing this rule disqualifies the applicant entirely
 *              (hard eligibility gate). If false, the rule only affects the
 *              weighted fit score.
 * weight:      point value/contribution used by the scoring engine when the
 *              rule is a SOFT (hard:false) rule. Ignored for hard rules.
 * explanation: human-readable text shown to the applicant/officer explaining
 *              what this rule checks and why it matters — used to generate
 *              eligibility/rejection/fit explanations without hardcoding
 *              copy in the backend rule engine.
 */
const ruleSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: [true, "Rule field is required"],
      trim: true,
    },
    operator: {
      type: String,
      required: [true, "Rule operator is required"],
      enum: {
        values: SUPPORTED_OPERATORS,
        message: `Operator must be one of: ${SUPPORTED_OPERATORS.join(", ")}`,
      },
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Rule value is required"],
      validate: {
        validator: function (val) {
          // "between" requires exactly two numeric bounds [min, max]
          if (this.operator === "between") {
            return Array.isArray(val) && val.length === 2;
          }
          // "in" requires a non-empty array of allowed values
          if (this.operator === "in") {
            return Array.isArray(val) && val.length > 0;
          }
          // all other operators expect a single scalar value
          return !Array.isArray(val);
        },
        message: (props) =>
          `Invalid value "${JSON.stringify(props.value)}" for the given operator.`,
      },
    },
    hard: {
      type: Boolean,
      required: true,
      default: true,
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, "Weight cannot be negative"],
    },
    explanation: {
      type: String,
      required: [true, "Rule explanation is required"],
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Scheme Schema
 * Represents a single government/financial scheme along with its
 * eligibility + scoring rules. Rules live entirely in MongoDB so the
 * rule engine can evaluate them generically without hardcoded logic.
 */
const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: String,
      required: [true, "schemeId is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Scheme name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Scheme description is required"],
      trim: true,
    },
    objective: {
      type: String,
      default: "",
      trim: true,
    },

    ministry: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    sectorType: {
      type: String,
      default: "",
      trim: true,
    },

    benefitHeadline: {
      type: String,
      default: "",
      trim: true,
    },

    maxCeilingText: {
      type: String,
      default: "",
      trim: true,
    },

    statutoryClause: {
      type: String,
      default: "",
      trim: true,
    },

    officialPortalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    eligibilityParameters: {
      type: [String],
      default: [],
    },

    requiredDocuments: {
      type: [String],
      default: [],
    },

    interestRate: {
      type: Number,
      min: [0, "Interest rate cannot be negative"],
      default: null,
    },
    maxLoanAmount: {
      type: Number,
      min: [0, "Maximum loan amount cannot be negative"],
      default: null,
    },
    maxTenureYears: {
      type: Number,
      min: [0, "Maximum tenure cannot be negative"],
      default: null,
    },
    moratoriumMonths: {
      type: Number,
      min: [0, "Moratorium months cannot be negative"],
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    recommendationEnabled: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 1,
      min: [1, "Version must be at least 1"],
    },
    rules: {
      type: [ruleSchema],
      default: [],
    },
    /**
     * Scoring configuration for the weighted fit score.
     * Kept in MongoDB (not hardcoded in the rule engine) so the base score
     * and score bounds can be tuned per-scheme without a code change.
     */
    scoring: {
      baseScore: {
        type: Number,
        default: 0,
        min: [0, "Base score cannot be negative"],
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
    },
  },
  { timestamps: true }
);

schemeSchema.index({ active: 1 });

module.exports = mongoose.model("Scheme", schemeSchema);
module.exports.SUPPORTED_OPERATORS = SUPPORTED_OPERATORS;