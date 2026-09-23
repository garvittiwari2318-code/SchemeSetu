const mongoose = require("mongoose");
const Application = require("../models/application");
const Scheme = require("../models/scheme");
const {
  createDraftApplication,
} = require("../services/applicationService");

const createApplication = async (req, res, next) => {
  try {
    /*
     * Authentication middleware will populate req.user.
     *
     * We intentionally do NOT accept applicant identity from the
     * request body. A client must never be able to create an
     * application on behalf of an arbitrary user.
     */
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      const error = new Error(
        "Authentication is required to create an application."
      );
      error.statusCode = 401;
      return next(error);
    }

    const { schemeId, answers } = req.body;

    const application = await createDraftApplication({
      userId,
      schemeId,
      answers,
    });

    const populatedApplication = await Application.findById(
      application._id
    )
      .populate("user", "name email")
      .populate(
        "scheme",
        "schemeId name objective ministry category sectorType benefitHeadline maxCeilingText officialPortalUrl requiredDocuments version"
      );

    res.status(201).json({
      success: true,
      data: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`Invalid application id: ${id}`);
      error.statusCode = 400;
      return next(error);
    }

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      const error = new Error(
        "Authentication is required to view an application."
      );
      error.statusCode = 401;
      return next(error);
    }

    const application = await Application.findOne({
      _id: id,
      user: userId,
    })
      .populate("user", "name email")
      .populate(
        "scheme",
        "schemeId name objective ministry category sectorType benefitHeadline maxCeilingText officialPortalUrl requiredDocuments version"
      );

    if (!application) {
      const error = new Error("Application not found.");
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

const getApplications = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      const error = new Error(
        "Authentication is required to view applications."
      );
      error.statusCode = 401;
      return next(error);
    }

    const filter = {
      user: userId,
    };

    if (req.query.schemeId) {
      const scheme = await Scheme.findOne({
        schemeId: req.query.schemeId.toLowerCase(),
      });

      if (!scheme) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }

      filter.scheme = scheme._id;
    }

    const applications = await Application.find(filter)
      .populate("user", "name email")
      .populate(
        "scheme",
        "schemeId name objective ministry category sectorType benefitHeadline maxCeilingText officialPortalUrl"
      )
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

module.exports = {
  createApplication,
  getApplicationById,
  getApplications,
};