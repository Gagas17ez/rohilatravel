const express = require("express");
const router = express.Router();

// Controller
const index = require("./index.controller");

// Routes
router.route("/").get(index.getAdminIndexPage);
router.route("/itinerary-log").get(index.getItineraryLogPage);

module.exports = router;
