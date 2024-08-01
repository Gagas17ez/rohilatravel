const express = require("express");
const router = express.Router();

// Controller
const index = require("./packages.controller");

// Routes
router.route("/").get(index.packagesPage);
router.route("/:id").get(index.detailPackagePage);

module.exports = router;
