const { encrypt } = require("../helpers/hashing.js");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "Users",
    {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase());
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("password", encrypt(value));
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(["admin", "user"]),
        allowNull: false
      }
    },
    {
      hooks: {
        beforeValidate: (users, options) => {
          if (!users.name) {
            users.name = users.email.split("@")[0];
          }
        },
      },
    }
  );

  return Users;
}
