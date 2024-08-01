const express = require("express");
const router = express.Router();

// Controller
const index = require("./blog.controller");

// Routes
router.route("/").get(index.getAllBlogs);
router.route("/:slug").get(index.getDetailBlog);

module.exports = router;
