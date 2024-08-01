const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Transportation = sequelize.define(
        "Transportation",
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
            desc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(11,2),
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM(["planes", "bus", "train", "travel", "bikes/car rental", "ship"]),
                allowNull: false,
            },
            route: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            fasility: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
    );
    return Transportation;
}
