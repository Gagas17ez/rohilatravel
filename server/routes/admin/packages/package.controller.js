const { db } = require("../../../models/index");
const { packages, destination, packages_destination, trip_type, Sequelize, acomodation, transportation, restaurant, packages_acomodation, packages_transportation, packages_restaurant } = db;

const response = require("../../../helpers/response");

// Pages
const getAdminPackagePage = async (req, res) => {
  const package = await packages.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: destination,
        attributes: ["id", "name", "address", "district_city", "images"],
        include: [
          {
            model: trip_type,
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: acomodation,
        attributes: ["id", "name", "images", "address", "price"],
      },
      {
        model: transportation,
        attributes: ["id", "name", "images", "route", "price"],
      },
      {
        model: restaurant,
        attributes: ["id", "name", "images", "address", "price"],
      },
    ],
  });
  return res.render("pages/admin/packages/index.njk", { package });
  // return res.render("pages/admin/packages/index");
};

const getAdminPackageDetailPage = async (req, res) => {
  const { id } = req.params;
  try {
    const package = await packages.findOne({
      where: { id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: destination,
          attributes: ["id", "name", "address", "district_city", "images"],
          include: [
            {
              model: trip_type,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: acomodation,
          attributes: ["id", "name", "images", "address", "price"],
        },
        {
          model: transportation,
          attributes: ["id", "name", "images", "route", "price"],
        },
        {
          model: restaurant,
          attributes: ["id", "name", "images", "address", "price"],
        },
      ],
    });
    console.log(package.Destinations);

    package.images = `${package.images}`;
    package.createdAt = package.createdAt.toISOString().split("T")[0];
    package.updatedAt = package.updatedAt.toISOString().split("T")[0];

    // return res.status(200).json({
    //   package
    // });
    res.render("pages/admin/packages/detail.njk", { package });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
  // return res.render("pages/admin/packages/detail");
};

const editAdminPackagePage = async (req, res) => {
  try {
    const { id } = req.params;
    const dest = await destination.findAll({ attributes: ["id", "name"] });
    const hotel = await acomodation.findAll({ attributes: ["id", "name", "price"] });
    const transport = await transportation.findAll({ attributes: ["id", "name", "price"] });
    const resto = await restaurant.findAll({ attributes: ["id", "name", "price"] });

    const relasiDesti = await packages_destination.findAll({ where: { PackageId: id } });
    const relasiHotel = await packages_acomodation.findAll({ where: { PackageId: id } });
    const relasiTransport = await packages_transportation.findAll({ where: { PackageId: id } });
    const relasiResto = await packages_restaurant.findAll({ where: { PackageId: id } });

    const packagesTour = await packages.findOne({ where: { id } });

    packagesTour.destinationId = relasiDesti.map((item) => item.DestinationId);
    packagesTour.acomodationId = relasiHotel.map((item) => item.AcomodationId);
    packagesTour.transportationId = relasiTransport.map((item) => item.TransportationId);
    packagesTour.restaurantId = relasiResto.map((item) => item.RestaurantId);

    packagesTour.createdAt = packagesTour.createdAt.toISOString().split("T")[0];
    packagesTour.updatedAt = packagesTour.updatedAt.toISOString().split("T")[0];

    return res.render("pages/admin/packages/edit", { packagesTour, dest, hotel, transport, resto });
  } catch (error) {
    console.log(error.message);
  }
};

const postAdminPackagePage = async (req, res) => {
  try {
    const dest = await destination.findAll({ attributes: ["id", "name"] });
    const hotel = await acomodation.findAll({ attributes: ["id", "name", "price"] });
    const transport = await transportation.findAll({ attributes: ["id", "name", "price"] });
    const resto = await restaurant.findAll({ attributes: ["id", "name", "price"] });

    return res.render("pages/admin/packages/create", { dest, hotel, transport, resto });
  } catch (error) {
    console.log(error.message);
  }
};

// Logic
const list = async (req, res) => {
  try {
    const data = await packages.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: destination,
          attributes: ["id", "name", "address", "district_city", "images"],
          include: [
            {
              model: trip_type,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: acomodation,
          attributes: ["id", "name", "images", "address", "price"],
        },
        {
          model: transportation,
          attributes: ["id", "name", "images", "route", "price"],
        },
        {
          model: restaurant,
          attributes: ["id", "name", "images", "address", "price"],
        },
      ],
    });
    return response.res200("Success fetch data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const create = async (req, res) => {
  try {
    const { title, duration, pax, price, desc, benefit, itinerary, policy, status, destinationId, acomodationId, transportationId, restaurantId } = JSON.parse(req.body.data);

    let images;

    if ((!title, !duration, !pax, !price, !desc, !benefit, !itinerary, !policy, !status, !destinationId)) {
      return response.res400("Please fill all required fields", res);
    }

    if (!req.file) {
      images = "img17.jpg";
    } else {
      images = req.file.filename;
    }

    if (typeof destinationId != "object" || typeof acomodationId != "object" || typeof transportationId != "object" || typeof restaurantId != "object") {
      return response.res400(`Sorry, fail create data | (id) destination/acomodation/transportation/restaurant must be an array`, res);
    }

    const data = await packages.create({ title, duration, images, pax, price, desc, benefit, itinerary, policy, status });

    for (let item of destinationId) {
      await packages_destination.create({ PackageId: data.id, DestinationId: item });
    }

    for (let item of acomodationId) {
      await packages_acomodation.create({ PackageId: data.id, AcomodationId: item });
    }

    for (let item of transportationId) {
      await packages_transportation.create({ PackageId: data.id, TransportationId: item });
    }

    for (let item of restaurantId) {
      await packages_restaurant.create({ PackageId: data.id, RestaurantId: item });
    }

    const dest = await destination.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: destinationId,
        },
      },
      attributes: ["name"],
    });

    const acom = await acomodation.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: acomodationId,
        },
      },
      attributes: ["name"],
    });

    const transport = await transportation.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: transportationId,
        },
      },
      attributes: ["name"],
    });

    const resto = await restaurant.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: restaurantId,
        },
      },
      attributes: ["name"],
    });

    const result = data.toJSON();
    result.images = images;
    result.destination = dest.map((item) => item.name);
    result.acomodation = acom.map((item) => item.name);
    result.transportation = transport.map((item) => item.name);
    result.restaurant = resto.map((item) => item.name);

    return response.res201("Success create data", result, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await packages.findOne({
      where: { id },
      include: [
        {
          model: destination,
          attributes: ["id", "name", "address", "district_city", "images"],
          include: [
            {
              model: trip_type,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: acomodation,
          attributes: ["id", "name", "images", "address", "price"],
        },
        {
          model: transportation,
          attributes: ["id", "name", "images", "route", "price"],
        },
        {
          model: restaurant,
          attributes: ["id", "name", "images", "address", "price"],
        },
      ],
    });
    if (!data) {
      return response.res400(`Sorry, fail get data | data with id ${id} is not found`, res);
    }
    return response.res200("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration, pax, price, desc, benefit, itinerary, policy, status, destinationId, acomodationId, transportationId, restaurantId } = JSON.parse(req.body.data);
    console.log(req.file);
    let images;

    if ((!title, !duration, !pax, !price, !desc, !benefit, !itinerary, !policy, !status, !destinationId)) {
      return response.res400("Please fill all required fields", res);
    }

    let updateData;
    if (!req.file) {
      updateData = await packages.update({ title, duration, pax, price, desc, benefit, itinerary, policy, status }, { where: { id } });
    } else {
      images = req.file.filename;
      updateData = await packages.update({ title, duration, images, pax, price, desc, benefit, itinerary, policy, status }, { where: { id } });
    }

    if (!updateData) {
      return response.res400(`Sorry, fail update data | data with id ${id} is not found`, res);
    }

    if (typeof destinationId != "object" || typeof acomodationId != "object" || typeof transportationId != "object" || typeof restaurantId != "object") {
      return response.res400(`Sorry, fail create data | (id) destination/acomodation/transportation/restaurant must be an array`, res);
    }

    await packages_destination.destroy({ where: { PackageId: id } });
    await packages_acomodation.destroy({ where: { PackageId: id } });
    await packages_transportation.destroy({ where: { PackageId: id } });
    await packages_restaurant.destroy({ where: { PackageId: id } });

    for (let item of destinationId) {
      await packages_destination.create({ PackageId: id, DestinationId: item });
    }
    for (let item of acomodationId) {
      await packages_acomodation.create({ PackageId: id, AcomodationId: item });
    }
    for (let item of transportationId) {
      await packages_transportation.create({ PackageId: id, TransportationId: item });
    }
    for (let item of restaurantId) {
      await packages_restaurant.create({ PackageId: id, RestaurantId: item });
    }

    const dest = await destination.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: destinationId,
        },
      },
      attributes: ["name"],
    });

    const acom = await acomodation.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: acomodationId,
        },
      },
      attributes: ["name"],
    });

    const transport = await transportation.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: transportationId,
        },
      },
      attributes: ["name"],
    });

    const resto = await restaurant.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: restaurantId,
        },
      },
      attributes: ["name"],
    });

    const updateAt = new Date();
    const data = { ...req.params, ...req.body };
    data.images = images;
    data.destination = dest.map((item) => item.name);
    data.acomodation = acom.map((item) => item.name);
    data.transportation = transport.map((item) => item.name);
    data.restaurant = resto.map((item) => item.name);
    data.updateAt = updateAt;

    return response.res201("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const del = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await packages.destroy({ where: { id } });
    if (!data) {
      return response.res400(`Sorry, fail delete data | data with id ${id} is not found`, res);
    }
    return response.res200("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

module.exports = {
  getAdminPackagePage,
  getAdminPackageDetailPage,
  editAdminPackagePage,
  postAdminPackagePage,
  list,
  create,
  detail,
  update,
  del,
};
