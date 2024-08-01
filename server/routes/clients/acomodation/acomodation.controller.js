const { db } = require("../../../models/index");
const { acomodation } = db;
const response = require("../../../helpers/response");

// Pages Render
const acomodationPage = async (req, res) => {
  try {
    const acomo = await acomodation.findAll({});
    res.render("pages/clients/acomodation/index.njk", { acomo });
  } catch (error) {
    console.log(error.message);
  }
};

const detailAcomodationPage = async(req, res) => {
  const { id } = req.params;

  const acomo = await acomodation.findByPk(id);
  if (!acomo) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }
  return res.render("pages/clients/acomodation/detail.njk", { acomo });
  // res.render("pages/clients/acomodation/detail.njk");
};

module.exports = {
  acomodationPage,
  detailAcomodationPage,
};
