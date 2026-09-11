const express = require("express");
const { getPartnersForScheme } = require("../controllers/ Partnercontroller");

const router = express.Router();

// GET /api/partners?schemeId=micro  -> partners authorised for a given scheme
router.get("/", getPartnersForScheme);

module.exports = router;