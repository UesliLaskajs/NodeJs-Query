const express = require("express");
const app = require("./app")
const mongoose = require("mongoose");
require("dotenv").config();

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

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


