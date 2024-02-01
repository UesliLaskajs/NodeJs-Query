const express = require("express");
const tours = require("../controllers/tours.controllers");

const Router = express.Router();

Router.route("/tour-plan/:year")
    .get(tours.getTourPlan, tours.getAllTours)

Router.route("/top-5-cheaps")
    .get(tours.aliasing, tours.getAllTours)


Router.route("/tour-stats")
    .get(tours.getTourStats, tours.getAllTours)

Router.route("/")
    .get(tours.getAllTours, tours.aliasing)
    .post(tours.createTour);

Router.route("/:id")
    .get(tours.getTour)
    .delete(tours.deleteTour)
    .patch(tours.updateTour);

module.exports = Router;
