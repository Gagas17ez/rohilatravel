const { db } = require("../../../models/index");
const { user: User, itinerary: Itinerary, blog: Blog, category: Category } = db;

const response = require("../../../helpers/response");

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.findAll({
    include: [
      {
        model: Category,
        attributes: ["name"],
      },
    ],
  });


  blogs.map((blog) => {
    blog.dataValues.createdAt = blog.dataValues.createdAt.toISOString().split("T")[0];
    blog.dataValues.updatedAt = blog.dataValues.updatedAt.toISOString().split("T")[0];
  });

  return res.render("pages/admin/blog/index", { blogs });
};

const createBlogPage = async (req, res) => {
  const categories = await Category.findAll();
  return res.render("pages/admin/blog/create", { categories });
};

const postBlogArticle = async (req, res) => {
  try {
    const { title, content, category, slug, isPublished } = req.body;
    if (!title || !content || !category || !slug || !isPublished) {
      return response.res400("Please fill all required fields", res);
    }
    if (!req.file) {
      return response.res400("Please upload a thumbnail", res);
    }
    const imageName = req.file.filename;
    console.log(imageName);

    await Blog.create({
      title,
      content,
      categoryId: category,
      slug,
      thumbnail: imageName,
      isPublished,
    });


    return res.status(201).redirect("/admin/blog");
  } catch (error) {
    console.error(error.message);
    res.send('<script>alert("Failed to post blog. Please check application log."); window.history.back();</script>');
  }
};

const uploadImages = async (req, res) => {
  try {
    const imageData = req.file.filename;
    return res.status(201).json({ url: `/uploads/${imageData}` });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to upload image" });
  }
}

const changeBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }
    const isPublished = blog.isPublished == 1 ? 0 : 1;
    await Blog.update({ isPublished }, { where: { id } });
    return res.status(200).redirect('/admin/blog');
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to update blog status" });
  }
};

const getBlogByID = async (req, res) => {
  const { id } = req.params;

  const categories = await Category.findAll();

  const blog = await Blog.findByPk(id);
  if (!blog) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }

  return res.render("pages/admin/blog/edit", { blog, categories });
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, slug, isPublished } = req.body;
    if (!title || !content || !category || !slug || !isPublished) {
      return response.res400("Please fill all required fields", res);
    }

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }

    let imageName = blog.thumbnail;
    if (req.file) {
      imageName = req.file.filename;
    }

    await Blog.update({
      title,
      content,
      categoryId: category,
      slug,
      thumbnail: imageName,
      isPublished,
    }, { where: { id } });

    return res.status(200).redirect("/admin/blog");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to update blog" });
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }

    await Blog.destroy({ where: { id } });
    return res.status(200).redirect("/admin/blog");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to delete blog" });
  }
}


module.exports = {
  getAllBlogs,
  getBlogByID,
  createBlogPage,
  postBlogArticle,
  uploadImages,
  changeBlogStatus,
  updateBlog,
  deleteBlog,
};
