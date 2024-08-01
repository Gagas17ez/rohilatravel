const { db } = require("../../../models/index");
const { transportation } = db;
const response = require("../../../helpers/response");

// Render Pages
const getAdminTransportationPage = async (req, res) => {
  const data = await transportation.findAll({});
  return res.render("pages/admin/transportation/index", { data });
};

const getAdminDetailTransportationPage = async (req, res) => {
  const { id } = req.params;
  try {
    const trans = await transportation.findOne({
      where: { id },
    });

    trans.images = `/uploads/${trans.images}`;
    trans.createdAt = trans.createdAt.toISOString().split("T")[0];
    trans.updatedAt = trans.updatedAt.toISOString().split("T")[0];

    console.log({ id });

    res.render("pages/admin/transportation/detail.njk", { trans });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const editAdminDetailTransportationPage = async (req, res) => {
  const { id } = req.params;

  const trans = await transportation.findByPk(id);
  if (!trans) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }

  return res.render("pages/admin/transportation/edit", { trans });
};

const postTransportationPage = async (req, res) => {
  return res.render("pages/admin/transportation/create");
};

// Logical
const list = async (req, res) => {
  try {
    const data = await transportation.findAll({
      order: [["name", "ASC"]],
    });
    return response.res200("Success fetch data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const create = async (req, res) => {
  try {
    const { name, desc, capacity, category, route, fasility, price } = req.body;
    if ((!name, !desc, !capacity, !category, !route, !fasility, !price)) {
      return response.res400("Please fill all required fields", res);
    }

    if (!req.file) {
      return response.res400("Please upload a image", res);
    }
    const images = req.file.filename;
    // console.log({ images });

    await transportation.create({
      name,
      desc,
      capacity,
      category,
      route,
      fasility,
      price,
      images: images,
    });

    return res.status(201).redirect("/admin/transportation");
  } catch (error) {
    console.log(error.message);
    res.send('<script>alert("Failed to post Transportation. Please check application log."); window.history.back();</script>');
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await transportation.findOne({ where: { id } });
    if (!data) {
      return response.res400(`Sorry, fail get data | data with id ${id} is not found`, res);
    }
    return response.res201("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, capacity, category, route, fasility, price } = req.body;
    if ((!name, !desc, !capacity, !category, !route, !fasility, !price)) {
      return response.res400("Please fill all required fields", res);
    }
    
    const trans = await transportation.findByPk(id);
    if (!trans) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }

    let images = trans.images;
    if (req.file) {
      images = req.file.filename;
    }

    const updateData = await transportation.update({ 
      name, 
      desc, 
      capacity, 
      category, 
      route, 
      fasility, 
      price,
      images: images 
    }, 
    { where: { id } });

    if (!updateData) {
      return response.res400(`Sorry, fail update data | data with id ${id} is not found`, res);
    }

    const data = { ...req.params, ...req.body };
    const updateAt = new Date();
    data.updateAt = updateAt;

    return res.status(200).redirect(`/admin/transportation/detail/${id}`);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const del = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await transportation.destroy({ where: { id } });
    if (!data) {
      return response.res400(`Sorry, fail delete data | data with id ${id} is not found`, res);
    }
    return response.res201("Success delete data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

module.exports = {
  getAdminTransportationPage,
  getAdminDetailTransportationPage,
  editAdminDetailTransportationPage,
  postTransportationPage,
  list,
  create,
  detail,
  update,
  del,
};
