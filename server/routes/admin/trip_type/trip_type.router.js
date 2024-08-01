const express = require("express");
const router = express.Router();

// Controller
const trip_type = require("./trip_type.controller");

// Routes
router.route("/api/list").get(trip_type.list);
router.route("/api/create").post(trip_type.create);
router.route("/api/update/:id").patch(trip_type.update);
router.route("/api/delete/:id").delete(trip_type.del);


module.exports = router;
