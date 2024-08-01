const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Acomodation = sequelize.define(
        "Acomodation",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                validate: {
                    isUUID: 4,
                },
                defaultValue: UUIDV4,
            },
            name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            images: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "img17.jpg",
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(11,2),
                allowNull: false,
            },
            lat: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            long: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            fasility: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            policy: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
    );
    return Acomodation;
}
