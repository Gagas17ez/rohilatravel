const { db } = require("../../../models/index");
const { trip_type: Trip_Type, type_trip_destination: Type_Trip_Destination } = db;

const response = require("../../../helpers/response");

const list = async (req, res) => {
  try {
    const tripType = await Trip_Type.findAll({ order: [['name', 'ASC']] });
    const data = await Promise.all(tripType.map(async item => {
      const qtyDestination = await Type_Trip_Destination.count({ where: { TripTypeId: item.id } });
      return { ...item.toJSON(), qtyDestination };
    }));
    return response.res200("Success fetch data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const create = async (req, res) => {
  try {
    const {name} = req.body;
    const data = await Trip_Type.create({ name });
    return response.res201("Success create data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const update = async (req, res) => {
  try {
    const {id} = req.params;
    const {name} = req.body;
    const updateData = await Trip_Type.update({ name }, {where: {id}});
    if(!updateData){
      return response.res400(`Sorry, fail delete data | data with id ${id} is not found`, res)
    }
    const updateAt = new Date();
    const data = {id, name, updateAt}
    return response.res201("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

const del = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await Trip_Type.destroy({where: {id}});
    if(!data){
      return response.res400(`Sorry, fail delete data | data with id ${id} is not found`, res)
    }
    return response.res201("Success update data", data, res);
  } catch (error) {
    console.log(error.message);
    response.res500(res);
  }
};

module.exports = {
  list,
  create,
  update,
  del
};
