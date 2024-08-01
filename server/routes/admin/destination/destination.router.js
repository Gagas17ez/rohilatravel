const express = require("express");
const router = express.Router();

// Controller
const destination = require("./destination.controller");

// Middleware
const upload = require("../../../helpers/multer");

// /admin/destination/
// Routes Pages
router.route("/").get(destination.getAdminDestinationPage);
router.route("/detail/:id").get(destination.getAdminDestinationDetailPage);
router.route("/edit/:id").get(destination.editAdminDestinationPage);
router.route("/create").get(destination.postAdminDestinationPage);

// Routes Logic/api
router.route("/api/list").get(destination.list);
router.route("/api/add").post(upload.single('images'), destination.create);
router.route("/api/detail/:id").get(destination.detail);
router.route("/api/update/:id").patch(upload.single('images'), destination.update);
router.route("/api/delete/:id").delete(destination.del);

module.exports = router;
