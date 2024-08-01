const express = require("express");
const router = express.Router();

// Middleware
const compression = require("compression");
const limit = require("../../../middlewares/rateLimiter");

// Controller
const destination = require("./destination.controller");

// Routes
router.route("/").get(destination.destinationPage);
router.route("/:id").get(destination.detailDestinationPage);
router.route("/bulk").get(destination.bulkData);

// router.route("/itinerary").post(index.generateItinerary);

module.exports = router;
