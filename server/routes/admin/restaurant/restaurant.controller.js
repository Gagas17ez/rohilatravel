const { db } = require("../../../models/index");
const { restaurant } = db;
const response = require("../../../helpers/response");

// Render Pages
const getAdminRestaurantPage = async (req, res) => {
  const data = await restaurant.findAll({});
  return res.render("pages/admin/restaurant/index", { data });
};

const getAdminDetailRestaurantPage = async (req, res) => {
  const { id } = req.params;
  try {
    const resto = await restaurant.findOne({
      where: { id },
    });

    resto.images = `/uploads/${resto.images}`;
    resto.createdAt = resto.createdAt.toISOString().split("T")[0];
    resto.updatedAt = resto.updatedAt.toISOString().split("T")[0];

    console.log({ id });

    res.render("pages/admin/restaurant/detail.njk", { resto });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
  // return res.render("pages/admin/restaurant/detail");
};

const editAdminDetailRestaurantPage = async (req, res) => {
  const { id } = req.params;

  const resto = await restaurant.findByPk(id);
  if (!resto) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }

  return res.render("pages/admin/restaurant/edit", { resto });
};

const postRestaurantPage = async (req, res) => {
  return res.render("pages/admin/restaurant/create");
};

// Logical
const list = async (req, res) => {
  try {
    const data = await restaurant.findAll({
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
    const { name, address, desc, price, lat, long, cook, service } = req.body;
    if ((!name, !address, !desc, !price, !lat, !long, !cook, !service)) {
      return response.res400("Please fill all required fields", res);
    }

    if (!req.file) {
      return response.res400("Please upload a image", res);
    }
    const images = req.file.filename;

    await restaurant.create({
      name,
      address,
      desc,
      price,
      lat,
      long,
      cook,
      service,
      images: images,
    });

    return res.status(201).redirect("/admin/restaurant");
  } catch (error) {
    console.log(error.message);
    res.send('<script>alert("Failed to post Restaurant. Please check application log."); window.history.back();</script>');
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await restaurant.findOne({ where: { id } });
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
    const { name, address, desc, price, lat, long, cook, service } = req.body;
    if ((!name, !address, !desc, !price, !lat, !long, !cook, !service)) {
      return response.res400("Please fill all required fields", res);
    }

    const resto = await restaurant.findByPk(id);
    if (!resto) {
      return res.status(404).render("pages/clients/errors/404.njk");
    }

    let images = resto.images;
    if (req.file) {
      images = req.file.filename;
    }

    const updateData = await restaurant.update(
      {
        name,
        address,
        desc,
        price,
        lat,
        long,
        cook,
        service,
        images: images,
      },
      { where: { id } }
    );

    if (!updateData) {
      return response.res400(`Sorry, fail update data | data with id ${id} is not found`, res);
    }

    const data = { ...req.params, ...req.body };
    const updateAt = new Date();
    data.updateAt = updateAt;

    return res.status(200).redirect(`/admin/restaurant/detail/${id}`);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const del = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await restaurant.destroy({ where: { id } });
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
  getAdminRestaurantPage,
  getAdminDetailRestaurantPage,
  editAdminDetailRestaurantPage,
  postRestaurantPage,
  list,
  create,
  detail,
  update,
  del,
};
