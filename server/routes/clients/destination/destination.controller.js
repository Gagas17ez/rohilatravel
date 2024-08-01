const { db } = require("../../../models/index");
const { destination: Destination, trip_type, Sequelize, type_trip_destination } = db;
const response = require("../../../helpers/response");
const listDestination = require("../../../../listDesinasiJatim.json");

// Pages Render
const destinationPage = async (req, res) => {
  try {
    const destination = await Destination.findAll({});
    res.render("pages/clients/destination/destination.njk", { destination });
  } catch (error) {
    console.log(error.message);
  }
};
const detailDestinationPage = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findOne({
      where: { id },
      include: [
          {
              model: trip_type,
              attributes: ['name']
          }
      ]
    });

    res.render("pages/clients/destination/detail.njk", { destination });
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

// Logic
const bulkData = async (req, res) => {
  let num = 1;
  for (let data of listDestination) {
    if (data.gambar != "https://sidita.disbudpar.jatimprov.go.id/assets/img/image_placeholder.jpg") {
      console.log(num);
      await Destination.create({
        name: data.nama,
        district_city: data["kabupaten/kota"],
        images: data.gambar,
        description: data.deskripsi,
        address: data.alamat,
        lat: data.lat,
        long: data.long,
        status: data["status buka"],
      });
    }
    num++;
  }
};

module.exports = {
  destinationPage,
  detailDestinationPage,
  bulkData,
};
