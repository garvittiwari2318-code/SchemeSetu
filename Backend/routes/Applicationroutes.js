const express = require("express");
const {
  createApplication,
  getApplicationById,
  getApplications,
} = require("../controllers/Applicationcontroller");

const router = express.Router();

// POST /api/applications      -> create + evaluate an application (no auth, prototype scope)
router.post("/", createApplication);

// GET  /api/applications      -> list applications (optional ?schemeId=micro)
router.get("/", getApplications);

// GET  /api/applications/:id  -> view a single application
router.get("/:id", getApplicationById);

module.exports = router;