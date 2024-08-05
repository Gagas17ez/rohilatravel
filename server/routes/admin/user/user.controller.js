const { db } = require("../../../models/index");
const { user: User, itinerary: Itinerary, blog: Blog, category: Category } = db;
const { v4: uuidv4 } = require('uuid');

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
    const { name, email, password } = req.body;
    const role = 'user'; // Role is set as 'user' for every new entry

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).send("Mohon masukkan semua data");
    }

    // Creating user in the database
    const user = await User.create({ name, email, password, role });
    console.log("Creating user with:", { name, email, password, role });

    // Return success response
    return res.status(201).json({ message: "Buat user berhasil", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Server error");
  }
};


module.exports = {
  getAdminUserPage,
  getAdminDetailUser,
  tambahUser,
};
