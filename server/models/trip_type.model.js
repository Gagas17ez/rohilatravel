const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Trip_Type = sequelize.define(
        "Trip_Type",
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
                unique: true,
                allowNull: false,
            },
        },
    );
    return Trip_Type;
}
