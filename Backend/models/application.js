const mongoose = require("mongoose");

/**
 * Application Schema
 * Represents a single applicant's application against a specific scheme,
 * capturing the submitted answers, the rule-engine evaluation result, and
 * the current workflow status.
 */
const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Application must belong to a user"],
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: [true, "Application must reference a scheme"],
    },
    schemeVersion: {
      // snapshot of the Scheme.version the applicant was evaluated against,
      // so future scheme rule changes don't retroactively alter past results
      type: Number,
      required: true,
    },
    // Raw applicant answers submitted for evaluation (income, cost, age, etc.)
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Application answers are required"],
      default: {},
    },
    // Result of running the rule engine against `answers` using the
    // scheme's rules (populated by the rule-engine service, not stored here).
    evaluation: {
      eligible: {
        type: Boolean,
        default: null,
      },
      score: {
        type: Number,
        default: null,
      },
      failedHardRules: {
        type: [String],
        default: [],
      },
      explanations: {
        type: [String],
        default: [],
      },
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, scheme: 1 });

module.exports = mongoose.model("Application", applicationSchema);