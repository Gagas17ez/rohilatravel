const { db } = require("../../../models/index");
const { restaurant } = db;
const response = require("../../../helpers/response");

// Pages Render
const restaurantPage = async(req, res) => {
  try {
    const resto = await restaurant.findAll({});
    res.render("pages/clients/restaurant/index.njk", { resto });
  } catch (error) {
    console.log(error.message);
  }
};

const detailRestaurantPage = async(req, res) => {
  const { id } = req.params;

  const resto = await restaurant.findByPk(id);
  if (!resto) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }

  // return res.render("pages/admin/restaurant/edit", { resto });
  return res.render("pages/clients/restaurant/detail.njk", { resto });
};

module.exports = {
  restaurantPage,
  detailRestaurantPage,
};
