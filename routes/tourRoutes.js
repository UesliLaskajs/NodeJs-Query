const express = require("express");
const tours = require("../controllers/tours.controllers");

const Router = express.Router();

Router.route("/")
    .get(tours.getAllTours)
    .post(tours.createTour);

Router.route("/:id")
    .get(tours.getTour)
    .delete(tours.deleteTour)
    .patch(tours.updateTour);

module.exports = Router;
