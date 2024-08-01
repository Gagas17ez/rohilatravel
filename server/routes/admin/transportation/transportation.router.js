const express = require("express");
const router = express.Router();

// Controller
const transportation = require("./transportation.controller");

// Middleware
const upload = require("../../../helpers/multer");

// Routes Pages
router.route("/").get(transportation.getAdminTransportationPage);
router.route("/detail/:id").get(transportation.getAdminDetailTransportationPage);
router.route("/edit/:id").get(transportation.editAdminDetailTransportationPage);
router.route("/create").get(transportation.postTransportationPage);

// Routes Logic/api
router.route("/api/list").get(transportation.list);
router.route("/store").post(upload.single('images'), transportation.create);
router.route("/api/detail/:id").get(transportation.detail);
router.route("/api/update/:id").post(upload.single('images'), transportation.update);
router.route("/api/delete/:id").delete(transportation.del);

module.exports = router;