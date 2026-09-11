const express = require("express");
const { getSchemes, getSchemeById } = require("../controllers/schemeController");

const router = express.Router();

// GET /api/schemes            -> list all schemes (optional ?active=true|false)
router.get("/", getSchemes);

// GET /api/schemes/:id        -> single scheme by Mongo _id or schemeId
router.get("/:id", getSchemeById);

module.exports = router;