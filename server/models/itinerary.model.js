const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Itinerary = sequelize.define("Itinerary", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
      defaultValue: UUIDV4,
    },
    lokasi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    jumlah_orang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mata_uang: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: false,
    },
    musim: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    lama_perjalanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipe_perjalanan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transportasi: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    hasil_itinerary: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  });
  return Itinerary;
};
