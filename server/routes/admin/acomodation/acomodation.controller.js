const { db } = require("../../../models/index");
const { acomodation } = db;

const response = require("../../../helpers/response");

// Render Pages
const getAdminAcomodationPage = async (req, res) => {
  const data = await acomodation.findAll({});
  return res.render("pages/admin/acomodation/index", { data });
};

const getAdminDetailAcomodationPage = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await acomodation.findOne({
      where: { id },
    });

    data.images = `/uploads/${data.images}`;
    data.createdAt = data.createdAt.toISOString().split("T")[0];
    data.updatedAt = data.updatedAt.toISOString().split("T")[0];

    console.log({ id });

    res.render("pages/admin/acomodation/detail.njk", { data });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
  // return res.render("pages/admin/acomodation/detail");
};

const editAdminDetailAcomodationPage = async (req, res) => {
  const { id } = req.params;

  const data = await acomodation.findByPk(id);
  if (!data) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }

  return res.render("pages/admin/acomodation/edit", { data });
  // return res.render("pages/admin/acomodation/edit");
};

const postAcomodationPage = async (req, res) => {
  return res.render("pages/admin/acomodation/create");
};

// Logical
const list = async (req, res) => {
  try {
    const data = await acomodation.findAll({
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
    const { name, address, desc, price, lat, long, fasility, policy } = req.body;
    if ((!name, !address, !desc, !price, !lat, !long, !fasility, !policy)) {
      return response.res400("Please fill all required fields", res);
    }

    if (!req.file) {
      return response.res400("Please upload a image", res);
    }

    const images = req.file.filename;
    console.log({ images });

    await acomodation.create({
      name,
      address,
      desc,
      price,
      lat,
      long,
      fasility,
      policy,
      price,
      images: images,
    });

    return res.status(201).redirect("/admin/acomodation");
  } catch (error) {
    console.log(error.message);
    res.send('<script>alert("Failed to post Acomodation. Please check application log."); window.history.back();</script>');
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await acomodation.findOne({ where: { id } });
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
    const { name, address, desc, price, lat, long, fasility, policy } = req.body;
    if ((!name, !address, !desc, !price, !lat, !long, !fasility, !policy)) {
      return response.res400("Please fill all required fields", res);
    }

    const data = await acomodation.findByPk(id);
    if (!data) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }

    let images = data.images;
    if (req.file) {
      images = req.file.filename;
    }

    const updateData = await acomodation.update({ 
      name, 
      address, 
      desc, 
      price, 
      lat, 
      long, 
      fasility, 
      policy, 
      images: images }, { where: { id } });

    if (!updateData) {
      return response.res400(`Sorry, fail update data | data with id ${id} is not found`, res);
    }

    const acomo = { ...req.params, ...req.body };
    const updateAt = new Date();
    acomo.images = images;
    acomo.updateAt = updateAt;

    // return response.res201("Success update data", data, res);
    return res.status(200).redirect(`/admin/acomodation/detail/${id}`);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const del = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await acomodation.destroy({ where: { id } });
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
  getAdminAcomodationPage,
  getAdminDetailAcomodationPage,
  editAdminDetailAcomodationPage,
  postAcomodationPage,
  list,
  create,
  detail,
  update,
  del,
};
