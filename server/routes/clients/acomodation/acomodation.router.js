const express = require("express");
const router = express.Router();

// Middleware
const compression = require("compression");
const limit = require("../../../middlewares/rateLimiter");

// Controller
const index = require("./acomodation.controller");

// Routes
router.route("/").get(index.acomodationPage);
router.route("/:id").get(index.detailAcomodationPage);

module.exports = router;
