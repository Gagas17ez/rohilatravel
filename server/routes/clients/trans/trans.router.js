const express = require("express");
const router = express.Router();

// Middleware
const compression = require("compression");
const limit = require("../../../middlewares/rateLimiter");

// Controller
const index = require("./trans.controller");

// Routes
router.route("/").get(index.transPage);
router.route("/:id").get(index.detailTransPage);

module.exports = router;
