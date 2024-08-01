const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Packages = sequelize.define(
        "Packages",
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
            title: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            images: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "img17.jpg",
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pax: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(11,2),
                allowNull: false,
                defaultValue: 0,
            },
            desc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            benefit: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            itinerary: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            policy: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(["Ready", "Closed"]),
                allowNull: false,
                defaultValue: "ready",
            },
        },
    );
    return Packages;
}
