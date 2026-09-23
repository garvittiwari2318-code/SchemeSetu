const mongoose = require("mongoose");

const applicationDocumentSchema = new mongoose.Schema(
  {
    requirementId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mandatory: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["pending", "uploaded", "verified", "rejected"],
      default: "pending",
    },

    fileReference: {
      type: String,
      default: null,
      trim: true,
    },

    uploadedAt: {
      type: Date,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "draft",
        "eligibility_confirmed",
        "documents_pending",
        "under_verification",
        "ready_for_submission",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
      required: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Application must belong to a user"],
      index: true,
    },

    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: [true, "Application must reference a scheme"],
      index: true,
    },

    /*
     * Snapshot of the exact scheme version used during evaluation.
     * This prevents future scheme changes from altering the historical
     * meaning of an existing application.
     */
    schemeVersion: {
      type: Number,
      required: true,
    },

    /*
     * Applicant answers used for eligibility evaluation.
     */
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Application answers are required"],
      default: {},
    },

    /*
     * Snapshot of the eligibility decision at application creation time.
     */
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

      evaluatedAt: {
        type: Date,
        default: null,
      },
    },

    /*
     * Current application lifecycle state.
     */
    status: {
      type: String,
      enum: [
        "draft",
        "eligibility_confirmed",
        "documents_pending",
        "under_verification",
        "ready_for_submission",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
      default: "draft",
      index: true,
    },

    /*
     * Immutable-ish audit trail of status changes.
     */
    statusHistory: {
      type: [applicationStatusHistorySchema],
      default: [],
    },

    /*
     * Documents required by the selected scheme and their
     * application-specific upload/verification state.
     */
    documents: {
      type: [applicationDocumentSchema],
      default: [],
    },

    /*
     * Information about the actual submission to an external
     * government/partner system.
     */
    submission: {
      mode: {
        type: String,
        enum: ["external_portal", "api"],
        default: null,
      },

      officialPortalUrl: {
        type: String,
        default: null,
        trim: true,
      },

      externalReference: {
        type: String,
        default: null,
        trim: true,
      },

      submittedAt: {
        type: Date,
        default: null,
      },
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, createdAt: -1 });
applicationSchema.index({ scheme: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);