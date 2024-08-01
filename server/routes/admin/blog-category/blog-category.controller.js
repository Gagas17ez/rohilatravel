const { db } = require("../../../models/index");
const { category: Category, blog: Blog } = db;

const getAllCategories = async (req, res) => {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
}

const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Please provide category name" });
    }

    try {
        const category = await Category.create({ name });
        return res.status(201).json(category);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to create category" });
    }
}

const getCategoryByID = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json(category);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to get category" });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Please provide category name" });
    }

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await Category.update({ name }, { where: { id } });
        return res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to update category" });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const blogCount = await Blog.count({ where: { categoryId: id } });
        if (blogCount > 0) {
            return res.status(400).json({ message: "Kategori sudah terasosiasi dengan blog yang dibuat" });
        }

        await Category.destroy({ where: { id } });
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Failed to delete category" });
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryByID,
    updateCategory,
    deleteCategory,
};