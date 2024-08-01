const { db } = require("../../../models/index");
const { user: User, itinerary: Itinerary, blog: Blog } = db;

const { compare } = require("../../../helpers/hashing");
const response = require("../../../helpers/response");
const userModel = require("../../../models/user.model");

const getAdminIndexPage = async (req, res) => {
  const user = await User.count();
  return res.render("pages/admin/index/index", { count: { user } });
};

const getItineraryLogPage = async (req, res) => {
  const itinerary = await Itinerary.findAll({});
  return res.render("pages/admin/index/itinerary-log", { itinerary });
};

module.exports = {
  getAdminIndexPage,
  getItineraryLogPage,
};
