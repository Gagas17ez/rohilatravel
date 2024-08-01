const { format } = require("morgan");
const response = require("../../../helpers/response");

const { db } = require("../../../models/index");
const { blog: Blog, category: Category } = db;

const sequelize = require("sequelize");
// Pages Render
const blogPage = (req, res) => {
  res.render("pages/clients/blog/blog.njk");
};

const detailBlogPage = (req, res) => {
  res.render("pages/clients/blog/detailBlog.njk");
};

// API
const getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 4;

  const categoryName = req.query.category;
  let whereCondition = {};
  let categoryParams = "";

  if (categoryName) {
    const category = await Category.findOne({
      where: { name: categoryName },
    });

    if (category) {
      whereCondition = { categoryId: category.id };
      categoryParams = `category=${categoryName}`;
    }
  }

  try {
    const blogs = await Blog.findAndCountAll({
      offset: (page - 1) * perPage,
      limit: perPage,
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
      where: whereCondition,
    });

    const latestBlog = await Blog.findAll({
      limit: 3,
      order: [["updatedAt", "DESC"]],
    });

    const categories = await Category.findAll({
      include: [{
        model: Blog,
        attributes: [],
        required: true, // Use required: false to perform left join
      }],
      attributes: [
        'name', // Fetching category name
        [sequelize.fn('COUNT', sequelize.col('categoryId')), 'count'] // Counting associated blogs
      ],
      group: ['Categories.id'] // Group by category id
    })

    latestBlog.forEach(blog => {
      blog.date = formattedDate(blog.updatedAt);
      blog.thumbnail = `/uploads/${blog.thumbnail}`;
    });

    blogs.rows.forEach(blog => {
      blog.thumbnail = `/uploads/${blog.thumbnail}`;
      blog.createdAt = blog.createdAt.toISOString().split("T")[0];
      blog.updatedAt = blog.updatedAt.toISOString().split("T")[0];
    });

    res.render("pages/clients/blog/blog.njk", { blogs, page, latestBlog, categories, categoryParams });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const getDetailBlog = async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await Blog.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });

    const latestBlog = await Blog.findAll({
      limit: 3,
      order: [["updatedAt", "DESC"]],
    });

    const categories = await Category.findAll({
      include: [{
        model: Blog,
        attributes: [],
        required: true, // Use required: false to perform left join
      }],
      attributes: [
        'name', // Fetching category name
        [sequelize.fn('COUNT', sequelize.col('categoryId')), 'count'] // Counting associated blogs
      ],
      group: ['Categories.id'] // Group by category id
    })

    latestBlog.forEach(blog => {
      blog.date = formattedDate(blog.updatedAt);
      blog.thumbnail = `/uploads/${blog.thumbnail}`;
    });

    blog.thumbnail = `/uploads/${blog.thumbnail}`;
    blog.date = formattedDate(blog.updatedAt);

    res.render("pages/clients/blog/detailBlog.njk", { blog, latestBlog, categories });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
}

const formattedDate = (date) => {
  const blogDate = new Date(date);
  const formattedDate = blogDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return formattedDate;
}

module.exports = {
  blogPage,
  detailBlogPage,
  getAllBlogs,
  getDetailBlog,
};
