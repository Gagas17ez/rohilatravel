const express = require("express");
const router = express.Router();

// Controller
const acomodation = require("./acomodation.controller");

// Middleware
const upload = require("../../../helpers/multer");

// Routes Pages
router.route("/").get(acomodation.getAdminAcomodationPage);
router.route("/detail/:id").get(acomodation.getAdminDetailAcomodationPage);
router.route("/edit/:id").get(acomodation.editAdminDetailAcomodationPage);
router.route("/create").get(acomodation.postAcomodationPage);

// Routes Logic/api
router.route("/api/list").get(acomodation.list);
router.route("/store").post(upload.single("images"), acomodation.create);
router.route("/api/detail/:id").get(acomodation.detail);
router.route("/api/update/:id").post(upload.single("images"), acomodation.update);
router.route("/api/delete/:id").delete(acomodation.del);

module.exports = router;
