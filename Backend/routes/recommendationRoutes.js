const express = require("express");
const { postRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

// POST /api/recommendations -> ranked eligible/ineligible schemes for an applicant profile
router.post("/", postRecommendations);

module.exports = router;