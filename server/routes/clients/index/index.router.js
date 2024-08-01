const express = require("express");
const router = express.Router();

// Middleware
const compression = require("compression");
const limit = require("../../../middlewares/rateLimiter");
const { isAuthLogin, isAuth } = require("../../../middlewares/isAuth");

// Controller
const index = require("./index.controller");

// Routes
router.route("/").get(index.indexPage);
router.route("/register").get(isAuthLogin, index.registerPage);
router.route("/login").get(isAuthLogin, index.loginPage);
router.route("/aboutUs").get(index.aboutUsPage);
router.route("/contactUs").get(index.contactUsPage);

router.route("/register").post(limit(2), isAuthLogin, index.register); // limit 2 request per minutes
router.route("/login").post(limit(3), isAuthLogin, index.login); // limit 3 request per minutes
router.route("/logout").get(isAuth, index.logout);
router.route("/itinerary").post(index.generateItinerary);
router.route("/hotels").post(index.getHotels);

module.exports = router;
