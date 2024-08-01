const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Blogs = sequelize.define(
        "Blogs",
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
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            thumbnail: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            isPublished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            categoryId: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: 4,
                },
            }
        },
    );
    return Blogs;
}
