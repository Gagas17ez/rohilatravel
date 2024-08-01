const { db } = require("../../../models/index");
const { user: User, itinerary: Itinerary, blog: Blog, category: Category } = db;

const { compare } = require("../../../helpers/hashing");
const response = require("../../../helpers/response");

const getAdminUserPage = async (req, res) => {
  const users = await User.findAll({});
  return res.render("pages/admin/user/index", { users });
};

const getAdminDetailUser = async (req, res) => {
  const user = await User.findOne({
    where: { userId: req.params.id },
    attributes: { exclude: ["password"] },
  });
  if (!user)
    return res.status(404).json({
      message: `User dengan id ${req.params.id} tidak ada`,
      data: null,
    });
  return res.status(200).json({
    message: `Berhasil get user dengan id ${req.params.id}`,
    data: user,
  });
};

const tambahUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return response.res400("Mohon masukkan semua data", res);
    await User.create({ name, email, password, role });
    return response.res201("Buat user berhasil", null, res);
  } catch (error) {
    console.error(error.message);
    response.res500(res);
  }
};

module.exports = {
  getAdminUserPage,
  getAdminDetailUser,
  tambahUser,
};
