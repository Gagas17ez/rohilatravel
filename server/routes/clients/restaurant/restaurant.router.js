const express = require("express");
const router = express.Router();

// Middleware
const compression = require("compression");
const limit = require("../../../middlewares/rateLimiter");

// Controller
const index = require("./restaurant.controller");

// Routes
router.route("/").get(index.restaurantPage);
router.route("/:id").get(index.detailRestaurantPage);

module.exports = router;
