const express = require('express');
const router = express.Router();

// Controller
const index = require('./blog-category.controller');

// Routes
router.route('/').get(index.getAllCategories);
router.route('/create').post(index.createCategory);
router.route('/edit/:id').get(index.getCategoryByID);
router.route('/edit/:id/update').put(index.updateCategory);
router.route('/delete/:id').delete(index.deleteCategory);

module.exports = router;