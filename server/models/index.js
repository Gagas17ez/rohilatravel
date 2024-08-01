const Sequelize = require('sequelize');
const dbConfig = require('../configs/db.config');
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load Model
db.user = require('./user.model')(sequelize, Sequelize);
db.itinerary = require('./itinerary.model')(sequelize, Sequelize);
db.blog = require('./blog.model')(sequelize, Sequelize);
db.category = require('./category.model')(sequelize, Sequelize);
db.destination = require('./destination.model')(sequelize, Sequelize);
db.trip_type = require('./trip_type.model')(sequelize, Sequelize);
db.type_trip_destination = require('./type_trip_destination.model')(sequelize, Sequelize);
db.packages = require('./packages.model')(sequelize, Sequelize);
db.packages_destination = require('./packages_destination.model')(sequelize, Sequelize);
db.acomodation = require('./acomodation.model')(sequelize, Sequelize);
db.restaurant = require('./restaurant.model')(sequelize, Sequelize);
db.transportation = require('./transportation.model')(sequelize, Sequelize);
db.packages_acomodation = require('./packages_acomodation.model')(sequelize, Sequelize);
db.packages_transportation = require('./packages_transportation.model')(sequelize, Sequelize);
db.packages_restaurant = require('./packages_restaurant.model')(sequelize, Sequelize);

//Relational
db.category.hasMany(db.blog, {foreignKey: 'categoryId', targetKey: 'id'});
db.blog.belongsTo(db.category, {foreignKey: 'categoryId', targetKey: 'id'});
db.destination.belongsToMany(db.trip_type, {through: db.type_trip_destination, onDelete: 'CASCADE'});
db.trip_type.belongsToMany(db.destination, {through: db.type_trip_destination, onDelete: 'CASCADE'});
db.packages.belongsToMany(db.destination, {through: db.packages_destination, onDelete: 'CASCADE'});
db.destination.belongsToMany(db.packages, {through: db.packages_destination, onDelete: 'CASCADE'});
db.packages.belongsToMany(db.acomodation, {through: db.packages_acomodation, onDelete: 'CASCADE'});
db.acomodation.belongsToMany(db.packages, {through: db.packages_acomodation, onDelete: 'CASCADE'});
db.packages.belongsToMany(db.transportation, {through: db.packages_transportation, onDelete: 'CASCADE'});
db.transportation.belongsToMany(db.packages, {through: db.packages_transportation, onDelete: 'CASCADE'});
db.packages.belongsToMany(db.restaurant, {through: db.packages_restaurant, onDelete: 'CASCADE'});
db.restaurant.belongsToMany(db.packages, {through: db.packages_restaurant, onDelete: 'CASCADE'});

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        await sequelize.sync({ force: false }); // Sync models with the database
        //   await sequelize.sync({ force: true }); // Drop all table and create new
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
        throw error; // rethrow the error to be caught in server.js
    }
};

module.exports = { db, initializeDatabase };