const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const Tours = require("../server/model/tours.model");

const port = process.env.PORT || 8000;
const DB = process.env.DATABASE_CLOUD.replace("PASSWORD", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected To Database");
    })
    .catch((err) => {
        console.log("Not Connected to Database", err);
    });

const data = fs.readFileSync("../tours-simple.json", 'utf-8');
const dataJs = JSON.parse(data);

const createData = async () => {
    try {
        await Tours.create(dataJs);
        console.log("SUCCESS Data Loaded");
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Tours.deleteMany();
        console.log("SUCCESS Data Deleted");
    } catch (err) {
        console.log(err);
    }
};

console.log(process.argv);

// Check the correct index and compare values for import and delete
if (process.argv[2] === "--import") {
    createData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
