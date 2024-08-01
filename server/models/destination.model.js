const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Destination = sequelize.define(
        "Destination",
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
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            district_city: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            images: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "img17.jpg"
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(255),
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
            status: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
        },
    );
    return Destination;
}
