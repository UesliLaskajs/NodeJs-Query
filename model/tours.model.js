const mongoose = require("mongoose")

const TourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "A tour must have a name"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a max Group Size"]
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
        type: Number,
        default: 56
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "A summary is required"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "A description is required"]
    },
    startDates: [Date],
    images: {
        type: [String], 
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model("tour", TourSchema)