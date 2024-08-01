const { db } = require("../../../models/index");
const { transportation } = db;
const response = require("../../../helpers/response");

// Pages Render
const transPage = async(req, res) => {
  try {
    const trans = await transportation.findAll({});
    res.render("pages/clients/transportation/index.njk", { trans });
  } catch (error) {
    console.log(error.message);
  }
};

const detailTransPage = async(req, res) => {
  const { id } = req.params;

  const trans = await transportation.findByPk(id);
  if (!trans) {
    return res.status(404).render("pages/clients/errors/404.njk");
  }
  return res.render("pages/clients/transportation/detail.njk", { trans });
};

module.exports = {
  transPage,
  detailTransPage,
};
