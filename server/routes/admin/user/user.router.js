const express = require("express");
const router = express.Router();

// Controller
const index = require("./user.controller");

// Routes
router.route("/").get(index.getAdminUserPage);
router.route("/:id").get(index.getAdminDetailUser);
router.route("/").post(index.tambahUser);

module.exports = router;
