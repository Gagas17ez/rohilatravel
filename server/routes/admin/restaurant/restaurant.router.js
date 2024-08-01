const express = require("express");
const router = express.Router();

// Controller
const restaurant = require("./restaurant.controller");

// Middleware
const upload = require("../../../helpers/multer");

// Routes Pages
router.route("/").get(restaurant.getAdminRestaurantPage);
router.route("/detail/:id").get(restaurant.getAdminDetailRestaurantPage);
router.route("/edit/:id").get(restaurant.editAdminDetailRestaurantPage);
router.route("/create").get(restaurant.postRestaurantPage);

// Routes Logic/api
router.route("/api/list").get(restaurant.list);
router.route("/store").post(upload.single('images'), restaurant.create);
router.route("/api/detail/:id").get(restaurant.detail);
router.route("/api/update/:id").post(upload.single('images'), restaurant.update);
router.route("/api/delete/:id").delete(restaurant.del);

module.exports = router;