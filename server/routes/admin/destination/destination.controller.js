const { db } = require("../../../models/index");
const { destination, trip_type, Sequelize, type_trip_destination } = db;

const response = require("../../../helpers/response");
const { where } = require("sequelize");

//Render Page
const getAdminDestinationPage = async (req, res) => {
  const data = await destination.findAll({});
  return res.render("pages/admin/destination/index", {data});
};

const getAdminDestinationDetailPage = async (req, res) => {
  const { id } = req.params;
  try {
    const desti = await destination.findOne({
      where: { id },
      order: [["name", "ASC"]],
      include: [
          {
              model: trip_type,
              attributes: ['name']
          }
      ]
    });

    desti.images = `/uploads/${desti.images}`;
    desti.createdAt = desti.createdAt.toISOString().split("T")[0];
    desti.updatedAt = desti.updatedAt.toISOString().split("T")[0];

    res.render("pages/admin/destination/detail.njk", { desti });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
  // return res.render("pages/admin/destination/detail");
};

const editAdminDestinationPage = async (req, res) => {
  try {
    const {id} = req.params;

    const tripType = await trip_type.findAll({ order: [['name', 'ASC']] });
    const relasiTrip = await type_trip_destination.findAll({ where: {DestinationId: id} });

    const desti = await destination.findOne({
      where: { id },
      order: [["name", "ASC"]],
    });

    const tipe = relasiTrip.map(item=>item.TripTypeId);
    desti.tripTypes = tipe;
    desti.createdAt = desti.createdAt.toISOString().split("T")[0];
    desti.updatedAt = desti.updatedAt.toISOString().split("T")[0];
    
    const city = [
      "Jakarta",
      "Bandung",
      "Semarang",
      "Surabaya",
      "Yogyakarta",
      "Malang",
    ];

    return res.render("pages/admin/destination/edit", {desti, city, tripType});
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const postAdminDestinationPage = async (req, res) => {
  const city = [
    "Jakarta",
    "Bandung",
    "Semarang",
    "Surabaya",
    "Yogyakarta",
    "Malang",
  ];
  return res.render("pages/admin/destination/create", { data: { city } });
};

// Logical
const list = async (req, res) => {
  try {
    const data = await destination.findAll({
      order: [["name", "ASC"]],
      include: [
          {
              model: trip_type,
              attributes: ['id','name']
          }
      ]
    });
    return response.res200("Success fetch data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const create = async (req, res) => {
  try {
    const { name, district_city, description, address, lat, long, status, typeTrip } =
      JSON.parse(req.body.data);

    let images;

    if (!name, !district_city, !description, !address, !lat, !long, !status) {
      response.res400("Please fill all required fields", res);
      return
    }

    if (!req.file) {
      images = "img17.jpg";
    } else {
      images = req.file.filename;
    }

    if(typeof(typeTrip) != 'object'){
      response.res400(
        `Sorry, fail create data | typeTrin must be an array`,
        res
      );
      return
    }
    
    const data = await destination.create({
      name,
      district_city,
      images,
      description,
      address,
      lat,
      long,
      status,
    });

    for(let item of typeTrip){
      await type_trip_destination.create({ TripTypeId: item, DestinationId: data.id });
    }
    
    const type = await trip_type.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: typeTrip
        }
      },
      attributes: ['name']
    });
    
    const result = data.toJSON();
    result.images = images;
    result.trip_type = type.map(item => item.name);
    
    return response.res201("Data successfully submitted", result, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await destination.findOne({
      where: { id },
      include: [
          {
              model: trip_type,
              attributes: ['id', 'name']
          }
      ]
    });
    if (!data) {
      return response.res400(
        `Sorry, fail get data | data with id ${id} is not found`,
        res
      );
    }
    return response.res201("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      district_city,
      description,
      address,
      lat,
      long,
      status,
      typeTrip
    } = JSON.parse(req.body.data);

    let images;

    if (!name, !district_city, !description, !address, !lat, !long, !status) {
      return response.res400("Please fill all required fields", res);
    }

    if(typeof(typeTrip) != 'object'){
      return response.res400(
        `Sorry, fail create data | typeTrin must be an array`,
        res
      );
    }

    await type_trip_destination.destroy({ where: { DestinationId: id } });

    for (let item of typeTrip) {
      await type_trip_destination.create({ TripTypeId: item, DestinationId: id });
    }

    let updateData;
    if (!req.file) {
      updateData = await destination.update(
        { name, district_city, description, address, lat, long, status },
        { where: { id } }
      );
    } else {
      images = req.file.filename;
      updateData = await destination.update(
        { name, district_city, images, description, address, lat, long, status },
        { where: { id } }
      );
    }

    if (!updateData) {
      return response.res400(
        `Sorry, fail update data | data with id ${id} is not found`,
        res
      );
    };

    const type = await trip_type.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: typeTrip
        }
      },
      attributes: ['name']
    });

    const updateAt = new Date();
    const data = { ...req.params, ...req.body };
    data.images = images;
    data.trip_type = type.map(item => item.name);
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
    const data = await destination.destroy({ where: { id } });
    if (!data) {
      return response.res400(
        `Sorry, fail delete data | data with id ${id} is not found`,
        res
      );
    }
    return response.res201("Success delete data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

module.exports = {
  getAdminDestinationPage,
  getAdminDestinationDetailPage,
  editAdminDestinationPage,
  postAdminDestinationPage,
  list,
  create,
  detail,
  update,
  del,
};
