const express = require("express");

const {
  createApplication,
  getApplicationById,
  getApplications,
} = require("../controllers/Applicationcontroller");

const { authenticate } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Start an application for an eligible scheme
 *     tags:
 *       - Applications
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schemeId
 *               - answers
 *             properties:
 *               schemeId:
 *                 type: string
 *                 example: term
 *               answers:
 *                 type: object
 *                 example:
 *                   age: 25
 *                   gender: male
 *                   income: 400000
 *                   category: no
 *                   purpose: business_new
 *                   cost: 700000
 *                   location: Delhi
 *     responses:
 *       201:
 *         description: Application created successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Scheme not found
 *       422:
 *         description: Applicant is not eligible
 */
router.post("/", authenticate, createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications belonging to the authenticated user
 *     tags:
 *       - Applications
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User applications
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticate, getApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get one application belonging to the authenticated user
 *     tags:
 *       - Applications
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Application details
 *       400:
 *         description: Invalid application ID
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Application not found
 */
router.get("/:id", authenticate, getApplicationById);

module.exports = router;