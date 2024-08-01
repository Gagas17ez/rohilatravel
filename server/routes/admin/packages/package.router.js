const express = require("express");
const router = express.Router();

// Controller
const packages = require("./package.controller");

// Middleware
const upload = require("../../../helpers/multer");

// Routes Pages
router.route("/").get(packages.getAdminPackagePage);
router.route("/detail/:id").get(packages.getAdminPackageDetailPage);
router.route("/edit/:id").get(packages.editAdminPackagePage);
router.route("/create").get(packages.postAdminPackagePage);

// Routes Logic/api
router.route("/api/list").get(packages.list);
router.route("/api/add").post(upload.single('images'), packages.create);
router.route("/api/detail/:id").get(packages.detail);
router.route("/api/update/:id").patch(upload.single('images'), packages.update);
router.route("/api/delete/:id").delete(packages.del);


module.exports = router;
