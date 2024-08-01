const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define(
        "Categories",
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
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
    );
    return Categories;
}
