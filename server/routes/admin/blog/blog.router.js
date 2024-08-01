const express = require("express");
const router = express.Router();

// Controller
const index = require("./blog.controller");
const upload = require("../../../helpers/multer");

// Routes
router.route("/").get(index.getAllBlogs);
router.route("/create").get(index.createBlogPage);

router.route("/store")
    .post(
        upload.single('thumbnail'),
        index.postBlogArticle);

router.route("/store-img")
    .post(
        upload.single('contentImg'),
        index.uploadImages);

router.route("/change-status/:id").get(index.changeBlogStatus);

router.route("/edit/:id").get(index.getBlogByID);
router.route("/edit/:id/update").post(upload.single('thumbnail'), index.updateBlog);

router.route("/delete/:id").get(index.deleteBlog);




module.exports = router;
